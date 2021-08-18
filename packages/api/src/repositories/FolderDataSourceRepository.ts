import fs from "fs";
import {FolderDataSource, StoredFolderDataSource} from "../models/FolderDataSource.interface";
import {randomBytes} from "crypto";
const db = require("better-sqlite3")('../../data/datasleuth.db');

class FolderDataSourceRepository {

    addDataSource(dataSource: FolderDataSource): [{ code: number, message: string }, { code: number, message: string }] {
        if (!fs.existsSync(dataSource.path)) {
            return [null, {
                "code": 404,
                "message": "Directory does not exist"
            }];
        }
        const uuid: string = randomBytes(16).toString("hex")
        try {
            db.prepare(
                'INSERT INTO folder_data (folder_name, path, uuid, tag1, tag2, dot_ignore) VALUES (?, ?, ?, ?, ?, ?);'
            ).run(
                FolderDataSourceRepository.getFolderName(dataSource.path),
                dataSource.path,
                uuid,
                dataSource.tag1,
                dataSource.tag2,
                "ignore certain files"
            )
        } catch (e) {
            return [null, {
                "code": 400,
                "message": "Folder datasource already exists"
            }];
        }
        return [{
            "code": 200,
            "message": "Successfully added file datasource"
        }, null];
    }

    getDataSource(uuid: string): [StoredFolderDataSource, { "code": number, "message": string }] {
        const dataSource = db.prepare("SELECT * FROM folder_data WHERE uuid = ?").get(uuid)
        if (dataSource !== undefined) {
            return [FolderDataSourceRepository.castToStoredDataSource(dataSource), null];
        }
        return [null, {
            "code": 404,
            "message": "Datasource not found"
        }]
    }

    getAllDataSources(): [StoredFolderDataSource[], { "code": number, "message": string }] {
        const fileDataList = db.prepare("SELECT * FROM file_data;").all()
        return [fileDataList.map(FolderDataSourceRepository.castToStoredDataSource), null];
    }

    deleteDataSource(uuid: string) {
        try {
            db.prepare("DELETE FROM folder_data WHERE uuid = ?").run(uuid);
        } catch (e) {
            console.error(e)
            return [null, {
                "code": 404,
                "message": "Folder datasource not found"
            }];
        }
        return [{
            "code": 204,
            "message": "Successfully deleted Folder datasource"
        }, null];
    }

    private static getFolderName(path: string) {
        return path.split("/").pop();
    }

    private static castToStoredDataSource(dataSource: any) {
        return {
            uuid: dataSource.uuid,
            path: dataSource.path,
            tag1: dataSource.tag1,
            tag2: dataSource.tag2
        };
    }
}

const folderDataSourceRepository = new FolderDataSourceRepository();
export default folderDataSourceRepository;