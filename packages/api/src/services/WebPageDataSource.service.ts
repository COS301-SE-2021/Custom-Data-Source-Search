import {WebPageDataSource, WebPageDataSourceList} from "../models/WebPageDataSource.interface";
import {TextDataSource} from "../models/TextDataSource.interface";

class WebPageDataSourceService {

    webPageDataSourceArray: WebPageDataSource[];

    constructor(){
        console.log("Web Page Data Source Service started");
        this.webPageDataSourceArray = [];
    }

    getAllWebPageDataSources() : WebPageDataSourceList{

        return this.webPageDataSourceArray;

    }

    getWebPageDataSource(index: number) {
        if (index >= this.webPageDataSourceArray.length || index < 0) {
            throw new Error('Index out of bounds');
        }
        return this.webPageDataSourceArray[index];
    }

    addWebPageDataSource(webUrl: string){

        const temp: WebPageDataSource = {url : webUrl}
        this.webPageDataSourceArray.push(temp);

    }

    async searchAllWebPageDataSources(searchString: string){

    }

    async searchWebPage(){

    }


}

const webPageDataSourceService = new WebPageDataSourceService();
export default webPageDataSourceService;