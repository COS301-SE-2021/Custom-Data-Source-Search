import {StoredTextDataSource} from "../models/TextDataSource.interface";
import {randomUUID} from "crypto";


class TextDataSourceRepository {

    textDataSourceArray: StoredTextDataSource[];

    constructor() {
        this.textDataSourceArray = [];
    }

    create(dataSource: StoredTextDataSource) {
        this.textDataSourceArray.push({
            uuid: randomUUID(),
            filename: dataSource.filename,
            path: dataSource.path
        });
    }

    read(uuid: string) {
        let index: number = this.textDataSourceArray.findIndex(x => x.uuid === uuid);
        if (index !== -1) {
            return [this.textDataSourceArray[index], null];
        }
        return [null, {
            "code":404,
            "message":"datasource not found"
        }]
    }
}

const textDataSourceRepository = new TextDataSourceRepository();
export default textDataSourceRepository;