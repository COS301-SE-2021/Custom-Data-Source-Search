import {WebPageDataSource} from "../models/WebPageDataSource.interface";

class WebPageDataSourceRepository {

    webPageDataSourceArray : WebPageDataSource[];

    constructor() {
        this.webPageDataSourceArray = [];
    }

}

const webPageDataSourceRepository = new WebPageDataSourceRepository();
export default webPageDataSourceRepository;