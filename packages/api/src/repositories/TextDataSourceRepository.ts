import {StoredTextDataSource} from "../models/TextDataSource.interface";


class TextDataSourceRepository {

    textDataSourceArray: StoredTextDataSource[];

    constructor() {
        this.textDataSourceArray = [];
    }


}

const textDataSourceRepository = new TextDataSourceRepository();
export default textDataSourceRepository;