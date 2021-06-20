import {StoredTextDataSource, TextDataSource} from "../models/TextDataSource.interface";
import {randomBytes} from "crypto";
import fs from "fs";


class TextDataSourceRepository {

    textDataSourceArray: StoredTextDataSource[];

    constructor() {
        this.textDataSourceArray = [];
    }

    addDataSource(dataSource: TextDataSource) {
        this.readFile()
        let index: number = this.textDataSourceArray.findIndex(x => x.path === dataSource.path && x.filename === dataSource.filename);
        if (index !== -1) {
            return [null, {
                "code":400,
                "message":"Datasource already exists"
            }];
        }
        this.textDataSourceArray.push({
            uuid: randomBytes(16).toString("hex"),
            filename: dataSource.filename,
            path: dataSource.path
        });
        fs.writeFileSync('./src/repositories/store/textDataStore.json', JSON.stringify(this.textDataSourceArray));
        return [{
            "code":200,
            "message":"Successfully added text datasource"
        }, null];
    }

    getDataSource(uuid: string): [StoredTextDataSource, {"code":number, "message":string}] {
        this.readFile()
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
        this.readFile()
        return [this.textDataSourceArray, null];
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
        this.readFile()
        let index: number = this.textDataSourceArray.findIndex(x => x.uuid === uuid);
        if (index !== -1) {
            this.textDataSourceArray.splice(index, 1);
            fs.writeFileSync('./src/repositories/store/textDataStore.json', JSON.stringify(this.textDataSourceArray));
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

    readFile(){
        try{
            this.textDataSourceArray = JSON.parse(fs.readFileSync('./src/repositories/store/textDataStore.json', 'utf-8'));
        } catch (err) {
            this.textDataSourceArray = [];
        }
    }
}

const textDataSourceRepository = new TextDataSourceRepository();
export default textDataSourceRepository;