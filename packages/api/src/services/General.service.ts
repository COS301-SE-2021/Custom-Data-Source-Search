import axios from "axios";
import fileDataSourceRepository from "../repositories/FileDataSourceRepository";
import fileDataSourceService from "./FileDataSource.service";

class GeneralService {

    constructor() {
        console.log("general Service Created");
    }

    async getResults(searchString: string) {

        const [results, error] = await this.searchAllDataSources(searchString);

        if (error) {
            return {
                "code": error.code,
                "body": {
                    "message": error.message
                }
            }
        }
        return {
            "code": 200,
            "body": {
                "message": "success",
                "searchResults": results
            }
        }
    }

    async searchAllDataSources(searchString: string) : Promise<[any[], {code: number, message: string}]> {
        try {
            console.log(searchString)
            let response: any  = await axios.get(
                'http://localhost:8983/solr/files/select?q='
                + searchString
                + '&q.op=OR&hl=true&hl.fl=content&hl.fragsize=200&hl.highlightMultiTerm=false&hl.simple.pre=<6b2f17de-2e79-4d28-899e-a3d02f9cb154open>&hl.simple.post=<6b2f17de-2e79-4d28-899e-a3d02f9cb154close>&hl.snippets=3'
            );
            let docs: any[] = response["data"]["response"]["docs"];
            let result: any[] = [];
            for (let [key, value] of Object.entries(response["data"]["highlighting"])) {
                let currentObject = docs.filter(function (doc) {
                    return doc.id == key;
                })[0];
                // @ts-ignore
                if (value["content"] != undefined) {
                    let occurrences: any[] = [];
                    let [datasource, err] = fileDataSourceRepository.getDataSource(key);
                    if (err) {
                        // @ts-ignore
                        for (let occurrence of value["content"]) {
                            occurrences.push({"occurrenceString": occurrence});
                        }
                        result.push({"type": currentObject["datasource_type"], "source": key, "occurrences": occurrences});
                    } else {
                        switch(currentObject["datasource_type"]) {
                            case "file":
                                // @ts-ignore
                                for (let occurrence of value["content"]) {
                                    occurrences.push({"occurrenceString": fileDataSourceService.getSearchSnippet(occurrence, datasource.filename)});
                                }
                                break;
                            default:
                            // code block
                                console.log("invalid datasource type");
                        }
                        result.push({
                                "icon": "<p>Hello</p>",
                                "type": currentObject["datasource_type"],
                                "source": datasource.path + datasource.filename,
                                "occurrences": occurrences
                            });
                    }
                }
            }
            return [result, null];
        } catch (e) {
            console.error(e)
            return [null, {
                "code": 500,
                "message": "Error when trying to search through solr"
            }]
        }
    }
}

const generalService = new GeneralService();
export default generalService;