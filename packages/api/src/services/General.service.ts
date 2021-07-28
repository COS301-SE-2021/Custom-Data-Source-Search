import folderDataSourceService from "./FolderDataSource.service";
import webPageDataSourceService from "./WebPageDataSource.service";
import axios from "axios";
import textDataSourceRepository from "../repositories/TextDataSourceRepository";

class GeneralService {

    constructor() {
        console.log("general Service Created");
    }

    async getResults(searchString: string) {

        const [folderResults, folderError] = await folderDataSourceService.searchAllFolderDataSources(searchString);
        const [textResults, textError] = await this.searchAllDataSources(searchString);
        const [pageResults, pagError] = await webPageDataSourceService.searchAllWebPageDataSources(searchString);

        let array: any[] = [];
        for (let result of folderResults) {
            array.push(result);
        }
        for (let result of textResults) {
            array.push(result);
        }
        for (let result of pageResults) {
            array.push(result);
        }

        if (textError || folderError || pagError) {
            return {
                "code": 500,
                "body": {
                    "message": "Error has occurred"
                }
            }
        }
        return {
            "code": 200,
            "body": {
                "message": "success",
                "searchResults": array
            }
        }
    }

    async searchAllDataSources(searchString: string) : Promise<[any[], Error]> {
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
                    let [datasource, err] = textDataSourceRepository.getDataSource(key);
                    // @ts-ignore
                    if (err) {
                        // @ts-ignore
                        result.push({"type": currentObject["datasource_type"], "source": key, "occurrences": occurrences});
                    } else {
                        // @ts-ignore
                        result.push({"type": currentObject["datasource_type"], "source": datasource.path + datasource.filename, "occurrences": occurrences});
                    }
                }
            }
            return [result, null];
        } catch (e) {
            console.error(e)
        }
    }
}

const generalService = new GeneralService();
export default generalService;