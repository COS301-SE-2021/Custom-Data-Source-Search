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

    async searchAllDataSources(searchString: string): Promise<[any[], { code: number, message: string }]> {
        try {
            let response: any = await axios.get(
                'http://localhost:8983/solr/files/select?q='
                + encodeURIComponent(searchString)
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
                        occurrences.push({"snippet": "Error: Document in solr does not contain a type"});
                        result.push({
                            "id": key,
                            "type": currentObject["datasource_type"],
                            "source": "Cannot locate source.",
                            "datasource_name": "Cannot locate name",
                            "datasource_icon": "icon",
                            "match_snippets": occurrences
                        });
                    } else {
                        switch (currentObject["datasource_type"]) {
                            case "file":
                                // @ts-ignore
                                for (let occurrence of value["content"]) {
                                    occurrences.push({
                                        "line_number": fileDataSourceService.getSnippetLineNumber(occurrence, currentObject["content"]),
                                        "snippet": fileDataSourceService.getSearchSnippet(occurrence, datasource.filename)
                                    });
                                }
                                result.push({
                                    "id": key,
                                    "type": currentObject["datasource_type"],
                                    "source": datasource.path + datasource.filename,
                                    "datasource_name": "Insert name here (General service)",
                                    "datasource_icon": "<svg title=\"File\" height=\"24\" width=\"24\" fill=\"#2ecc71\" viewBox=\"0 0 24 24\"><path d=\"M0 0h24v24H0V0z\" fill=\"none\"></path><path d=\"M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z\"></path></svg>",
                                    "match_snippets": occurrences
                                });
                                break;
                            default:
                                // code block
                                console.log("invalid datasource type");
                        }
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
    async getFullFile(type: string, id: string) {
        try {
            let response: any = await axios.get(
                'http://localhost:8983/solr/files/select?q=id%3A'
                + id
                + '&q.op=OR&hl=true&hl.fl=content&hl.fragsize=200&hl.highlightMultiTerm=false&hl.simple.pre=<6b2f17de-2e79-4d28-899e-a3d02f9cb154open>&hl.simple.post=<6b2f17de-2e79-4d28-899e-a3d02f9cb154close>&hl.snippets=3'
            );
            let docs: any[] = response["data"]["response"]["docs"];
            return {
                "code": 200,
                "body": {
                    "message": "success",
                    "data": this.newLinesToBreaks(docs[0]["content"].toString())
                }
            }
        } catch (e) {
            return {
                "code": 500,
                "body": {
                    "message": "Could not get file from solr"
                }
            }
        }
    }

    private newLinesToBreaks(content: string) {
        let result: string = "";
        let index: number = content.indexOf('\n');
        let count: number = 1;
        while (index !== -1) {
            result += content.substr(0, index) + '<br id="line_number_' + count++ + '">';
            content = content.substr(index + 1, content.length);
            index = content.indexOf('\n');
        }
        result += content;
        return result;
    }
}

const generalService = new GeneralService();
export default generalService;