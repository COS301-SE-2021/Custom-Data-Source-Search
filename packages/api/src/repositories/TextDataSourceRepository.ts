import {StoredTextDataSource, TextDataSource} from "../models/TextDataSource.interface";
import {randomUUID} from "crypto";


class TextDataSourceRepository {

    textDataSourceArray: StoredTextDataSource[];

    constructor() {
        this.textDataSourceArray = [];
    }

    addDataSource(dataSource: StoredTextDataSource) {
        this.textDataSourceArray.push({
            uuid: randomUUID(),
            filename: dataSource.filename,
            path: dataSource.path
        });
    }

    getDataSource(uuid: string) {
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