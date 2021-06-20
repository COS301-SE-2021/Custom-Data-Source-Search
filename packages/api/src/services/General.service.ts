import textDataSourceService from "./TextDataSource.service";
import webPageDataSourceService from "./WebPageDataSource.service";

class GeneralService {

    constructor() {
        console.log("general Service Created");
    }

    async getResults(searchString: string) {

      const [textResults, texterror] = await textDataSourceService.searchAllTextDataSources(searchString);

       const [pageResults,pagerror] = await webPageDataSourceService.searchAllWebPageDataSources(searchString);

        //const results = await Promise.all([text, page]);
        if (texterror) {
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
                        "type": "textDatasource",
                        "results": textResults
                    },

                    {
                        "type": "webPageDatasource",
                        "results": pageResults
                    }
                ]
            }
        }
    }
}

const generalService = new GeneralService();
export default generalService;