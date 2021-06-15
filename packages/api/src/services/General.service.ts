import textDataSourceService from "./TextDataSource.service";

class GeneralService {

    constructor(){
        console.log("general Service Created");
    }

    async getResults(searchString : string){

        const textResults = await textDataSourceService.searchAllTextDataSources(searchString);

        //const dbResults = await databaseDataSourceService.searchAllDBSources(searchString);

        //const results await Promise.all([textResults]);
        return {
            "code":200,
            "body":{
                "type":"textDatasource",
                "data":textResults
            }
        }
    }
}

const generalService = new GeneralService();
export default generalService;