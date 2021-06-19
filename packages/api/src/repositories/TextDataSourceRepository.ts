import {StoredTextDataSource, TextDataSource} from "../models/TextDataSource.interface";
import {randomBytes} from "crypto";


class TextDataSourceRepository {

    textDataSourceArray: StoredTextDataSource[];

    constructor() {
        this.textDataSourceArray = [];
    }

    addDataSource(dataSource: TextDataSource) {
        this.textDataSourceArray.push({
            uuid: randomBytes(16).toString("hex"),
            filename: dataSource.filename,
            path: dataSource.path
        });
        return [{
            "code":200,
            "message":"Successfully added text datasource"
        }, null];
    }

    getDataSource(uuid: string): [StoredTextDataSource, {"code":number, "message":string}] {
        let index: number = this.textDataSourceArray.findIndex(x => x.uuid === uuid);
        if (index !== -1) {
            return [this.textDataSourceArray[index], null];
        }
        return [null, {
            "code": 404,
            "message": "Datasource not found"
        }]
    }

    getAllDataSources() {
        return [this.textDataSourceArray, null]
    }

    updateDataSource(uuid: string, dataSource: TextDataSource) {
        let index: number = this.textDataSourceArray.findIndex(x => x.uuid === uuid);
        if (index !== -1) {
            this.textDataSourceArray[index].path = dataSource.path;
            this.textDataSourceArray[index].filename = dataSource.filename;
            return [{
                "code": 200,
                "message": "Successfully updated datasource"
            }, null]
        }
        return [null, {
            "code": 404,
            "message": "Datasource not found"
        }]
    }

    deleteDataSource(uuid: string) {
        let index: number = this.textDataSourceArray.findIndex(x => x.uuid === uuid);
        if (index !== -1) {
            this.textDataSourceArray.splice(index, 1);
            return [{
                "code": 200,
                "message": "Successfully deleted datasource"
            }, null]
        }
        return [null, {
            "code": 404,
            "message": "Datasource not found"
        }]
    }
}

const textDataSourceRepository = new TextDataSourceRepository();
export default textDataSourceRepository;