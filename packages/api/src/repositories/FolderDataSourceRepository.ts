import fs from "fs";
import {FolderDataSource, StoredFolderDataSource} from "../models/FolderDataSource.interface";
import {randomBytes} from "crypto";
import FormData from "form-data";
import axios from "axios";
import fileDataSourceRepository from "./FileDataSourceRepository";
const db = require("better-sqlite3")('../../data/datasleuth.db');

class FolderDataSourceRepository {

    addDataSource(dataSource: FolderDataSource): [{ code: number; message: string; uuid: string }, { code: number; message: string; }] {
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
            "message": "Successfully added file datasource",
            "uuid": uuid
        }, null];
    }

    async addFileInFolder(filePath: string, folderUUID: string) {
        const uuid: string = randomBytes(16).toString("hex")
        const [, err] = await this.postToSolr(
            fs.readFileSync(filePath), uuid, FolderDataSourceRepository.getFileName(filePath)
        );
        if (err) {
            return [null, {
                "code": 500,
                "message": "Could not add file to solr"
            }];
        }
        try {
            db.prepare(
                'INSERT INTO folder_file_data (file_path, last_modified, folder_uuid, uuid) VALUES (?, ?, ?, ?);'
            ).run(
                filePath,
                fs.statSync(filePath).mtime.getTime(),
                folderUUID,
                uuid
            )
        } catch (e) {
            console.error(e);
            return [null, {
                "code": 400,
                "message": "File from folder datasource already exists"
            }];
        }
        return [{
            "code": 200,
            "message": "Successfully added file from folder datasource"
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
        const fileDataList = db.prepare("SELECT * FROM folder_data;").all()
        return [fileDataList.map(FolderDataSourceRepository.castToStoredDataSource), null];
    }

    async deleteDataSource(uuid: string) {
        try {
            for (let folderFile of db.prepare("SELECT * FROM folder_file_data WHERE folder_uuid = ?;").all(uuid)) {
                await fileDataSourceRepository.deleteFromSolr(folderFile["uuid"]);
            }
            db.prepare("DELETE FROM folder_file_data WHERE folder_uuid = ?").run(uuid);
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
        return path.substr(0, path.length - 1).split("/").pop();
    }

    private static castToStoredDataSource(dataSource: any) {
        return {
            uuid: dataSource.uuid,
            path: dataSource.path,
            tag1: dataSource.tag1,
            tag2: dataSource.tag2
        };
    }

    async postToSolr(file: Buffer, id: string, fileName: string) {
        let formData = new FormData();
        fileName = fileDataSourceRepository.removeExtension(fileName);
        formData.append("file", file, fileName);
        try {
            await axios.post('http://localhost:' + process.env.SOLR_PORT + '/solr/files/update/extract?literal.id=' + id
                + '&commit=true&literal.datasource_type=folder',
                formData,
                {
                    headers: {
                        ...formData.getHeaders()
                    }
                });
        } catch (e) {
            console.error(e)
            return [null, {
                "code": 500,
                "message": "Could not post file from folder to solr"
            }]
        }
        return [{
            "code": 200,
            "message": "Successfully posted to Solr"
        }]
    }

    private static getFileName(filePath: string) {
        return filePath.split("/").pop();
    }

    getFolderFromFile(uuid: string) {
        try {
            const dataSource = db.prepare(
                "SELECT * FROM folder_data WHERE uuid = (SELECT folder_uuid FROM folder_file_data WHERE uuid = ?)"
            ).all(uuid)[0];
            return [dataSource, null];
        } catch (e) {
            console.error(e);
            return [null, {
                "code": 404,
                "message": "Datasource not found"
            }]
        }
    }
}

const folderDataSourceRepository = new FolderDataSourceRepository();
export default folderDataSourceRepository;