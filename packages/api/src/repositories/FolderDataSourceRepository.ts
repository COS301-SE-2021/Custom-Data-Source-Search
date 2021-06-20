import fs from "fs";
import {StoredFolderDataSource} from "../models/FolderDataSource.interface";
import {StoredTextDataSource} from "../models/TextDataSource.interface";

class FolderDataSourceRepository {
    folderDataSourceArray: StoredFolderDataSource[];

    constructor() {
        this.folderDataSourceArray = [];
    }

    addDataSource() {

    }

    getDataSource(uuid: string): [StoredFolderDataSource, {"code":number, "message":string}] {
        this.readFile()
        let index: number = this.folderDataSourceArray.findIndex(x => x.uuid === uuid);
        if (index !== -1) {
            return [this.folderDataSourceArray[index], null];
        }
        return [null, {
            "code": 404,
            "message": "Datasource not found"
        }]
    }

    getAllDataSources(): any {
        this.readFile()
        return [this.folderDataSourceArray, null];
    }

    updateDataSource(uuid: string) {

    }

    deleteDataSource(uuid: string) {

    }

    readFile() {
        try {
            this.folderDataSourceArray = JSON.parse(fs.readFileSync('./src/repositories/store/folderDataStore.json', 'utf-8'));
        } catch (err) {
            this.folderDataSourceArray = [];
        }
    }
}

const folderDataSourceRepository = new FolderDataSourceRepository();
export default folderDataSourceRepository;