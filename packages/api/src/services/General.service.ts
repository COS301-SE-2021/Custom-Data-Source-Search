import textDataSourceService from "./TextDataSource.service";
import folderDataSourceService from "./FolderDataSource.service";
import webPageDataSourceService from "./WebPageDataSource.service";

class GeneralService {

    constructor() {
        console.log("general Service Created");
    }

    async getResults(searchString: string) {

        const [folderResults, folderError] = await folderDataSourceService.searchAllFolderDataSources(searchString);
        const [textResults, texterror] = await textDataSourceService.searchAllTextDataSources(searchString);

        const [pageResults,pagerror] = await webPageDataSourceService.searchAllWebPageDataSources(searchString);

        //const results await Promise.all([textResults]);
        if (texterror || folderError || pagerror) {
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
                "data": [
                    {
                        "type": "text",
                        "results": textResults
                    },
                    {
                        "type": "folder",
                        "results": folderResults
                    },
                    {
                        "type": "webpage",
                        "results": pageResults
                    }
                ]
            }
        }
    }
}

const generalService = new GeneralService();
export default generalService;