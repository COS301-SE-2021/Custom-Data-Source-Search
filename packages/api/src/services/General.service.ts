import axios from "axios";
import fileDataSourceRepository from "../repositories/FileDataSourceRepository";

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
            let response: any  = await axios.get(
                'http://localhost:8983/solr/files/select?q='
                + encodeURIComponent(searchString)
                + '&q.op=OR&hl=true&hl.fl=content&hl.fragsize=200&hl.highlightMultiTerm=false&hl.simple.pre=<em style="color: %2388ffff">&hl.snippets=3'
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
                    // @ts-ignore
                    for (let i = 0; i < value["content"].length; i++) {
                        // @ts-ignore
                        occurrences.push({"occurrenceString": value["content"][i]});
                    }
                    let [datasource, err] = fileDataSourceRepository.getDataSource(key);
                    // @ts-ignore
                    if (err) {
                        // @ts-ignore
                        result.push({"type": currentObject["datasource_type"], "source": key, "occurrences": occurrences});
                    } else {
                        switch(currentObject["datasource_type"]) {
                            case "file":
                                // code block
                                break;
                            default:
                            // code block
                                console.log("invalid datasource type");
                        }
                        result.push({"type": currentObject["datasource_type"], "source": datasource.path + datasource.filename, "occurrences": occurrences});
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