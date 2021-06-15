import textDataSourceService from "./TextDataSource.service";

class GeneralService {

    constructor() {
        console.log("general Service Created");
    }

    async getResults(searchString: string) {

        const [textResults, error] = await textDataSourceService.searchAllTextDataSources(searchString);

        //const dbResults = await databaseDataSourceService.searchAllDBSources(searchString);

        //const results await Promise.all([textResults]);
        if (error) {
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
                    }
                ]
            }
        }
    }
}

const generalService = new GeneralService();
export default generalService;