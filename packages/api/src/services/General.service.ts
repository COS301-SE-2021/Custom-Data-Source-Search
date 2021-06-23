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

        let array: any[] = [];
        let i: number = 0;
        while (folderResults.hasOwnProperty(i)) {
            array.push(folderResults[i++]);
        }
        i = 0;
        while (textResults.hasOwnProperty(i)) {
            array.push(textResults[i++]);
        }
        i = 0;
        while (pageResults.hasOwnProperty(i)) {
            array.push(pageResults[i++]);
        }

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
                "searchResults": array
            }
        }
    }
}

const generalService = new GeneralService();
export default generalService;