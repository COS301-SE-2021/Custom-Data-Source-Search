import textDataSourceService from "./TextDataSource.service";
import folderDataSourceService from "./FolderDataSource.service";
import webPageDataSourceService from "./WebPageDataSource.service";

class GeneralService {

    constructor() {
        console.log("general Service Created");
    }

    async searchAllDataSources(searchString: string) {

        const [folderResults, folderError] = await folderDataSourceService.searchAllFolderDataSources(searchString);
        const [textResults, textError] = await textDataSourceService.searchAllTextDataSources(searchString);
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
}

const generalService = new GeneralService();
export default generalService;