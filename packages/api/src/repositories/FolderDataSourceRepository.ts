import fs from "fs";
import {FolderDataSource, StoredFolderDataSource} from "../models/FolderDataSource.interface";
import {randomBytes} from "crypto";

class FolderDataSourceRepository {
    folderDataSourceArray: StoredFolderDataSource[];

    constructor() {
        this.folderDataSourceArray = [];
    }

    addDataSource(dataSource: FolderDataSource) {
        this.readFile()
        let index: number = this.folderDataSourceArray.findIndex(x => x.path === dataSource.path);
        if (index !== -1) {
            return [null, {
                "code": 400,
                "message": "Folder datasource already exists"
            }];
        }
        this.folderDataSourceArray.push({
            uuid: randomBytes(16).toString("hex"),
            path: dataSource.path
        });
        fs.writeFileSync('./src/repositories/store/folderDataStore.json', JSON.stringify(this.folderDataSourceArray));
        return [{
            "code": 200,
            "message": "Successfully added folder datasource"
        }, null];
    }

    getDataSource(uuid: string): [StoredFolderDataSource, { "code": number, "message": string }] {
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

    deleteDataSource(uuid: string) {
        this.readFile()
        let index: number = this.folderDataSourceArray.findIndex(x => x.uuid === uuid);
        if (index !== -1) {
            this.folderDataSourceArray.splice(index, 1);
            fs.writeFileSync('./src/repositories/store/folderDataStore.json', JSON.stringify(this.folderDataSourceArray));
            return [{
                "code": 204,
                "message": "Successfully deleted folder datasource"
            }, null]
        }
        return [null, {
            "code": 404,
            "message": "Folder datasource not found"
        }]
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