import {StoredFileDataSource, FileDataSource} from "../models/FileDataSource.interface";
import {randomBytes} from "crypto";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
const db = require("better-sqlite3")('../../data/datasleuth.db');



class FileDataSourceRepository {

    async addDataSource(dataSource: FileDataSource): Promise<[{ code: number, message: string }, { code: number, message: string }]> {
        const uuid: string = randomBytes(16).toString("hex")
        try {
            db.prepare(
                'INSERT INTO file_data VALUES (?, ?, ?, ?, ?);'
            ).run(
                uuid,
                dataSource.path + dataSource.filename,
                fs.statSync(dataSource.path + dataSource.filename).mtime.getTime(),
                dataSource.tag1,
                dataSource.tag2
            )
        } catch (e) {
            return [null, {
                "code": 400,
                "message": "File datasource already exists"
            }];
        }
        const [, err] = await this.postToSolr(
            fs.readFileSync(dataSource.path + dataSource.filename), uuid, dataSource.filename
        );
        if (err) {
            await this.deleteDataSource(uuid);
            return [null, err];
        }
        return [{
            "code": 200,
            "message": "Successfully added file datasource"
        }, null];
    }

    makeDefaultExtension(fileName: string) {
        let lastIndex: number = fileName.lastIndexOf(".");
        fileName = fileName.substring(0, lastIndex);
        return fileName;
    }

    async postToSolr(file: Buffer, id: string, fileName: string) {
        let formData = new FormData();
        fileName = this.makeDefaultExtension(fileName);
        formData.append("file", file, fileName);
        try {
            await axios.post('http://localhost:' + process.env.SOLR_PORT + '/solr/files/update/extract?literal.id=' + id
                + '&commit=true&literal.datasource_type=file',
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
                "message": "Could not post file to solr"
            }]
        }
        return [{
            "code": 200,
            "message": "Successfully posted to Solr"
        }]
    }

    async updateDatasources() {
        const fileDataList = db.prepare("SELECT * FROM file_data;").all()
        for (let fileData of fileDataList) {
            let lastModified: number = fs.statSync(fileData.file_path).mtime.getTime();
            if (fileData.last_modified !== lastModified) {
                try {
                    await this.postToSolr(
                        fs.readFileSync(fileData.file_path),
                        fileData.uuid,
                        fileData.file_path.split("/").pop()
                    );
                    db.prepare("UPDATE file_data SET last_modified = ? WHERE uuid = ?").run(lastModified, fileData.uuid)
                } catch (e) {
                    console.log("Error posting file to solr");
                }
            }
        }
    }

    getDataSource(uuid: string): [StoredFileDataSource, { "code": number, "message": string }] {
        const dataSource = db.prepare("SELECT * FROM file_data WHERE uuid = ?").get(uuid)
        if (dataSource !== undefined) {
            return [FileDataSourceRepository.castToStoredDataSource(dataSource), null];
        }
        return [null, {
            "code": 404,
            "message": "Datasource not found"
        }]
    }

    private static castToStoredDataSource(dataSource: any): StoredFileDataSource {
        const filename = dataSource.file_path.split("/").pop();
        return {
            uuid: dataSource.uuid,
            filename: filename,
            path: dataSource.file_path.substr(0, dataSource.file_path.length - filename.length),
            lastModified: new Date(dataSource.last_modified),
            tag1: dataSource.tag1,
            tag2: dataSource.tag2
        };
    }

    getAllDataSources(): [StoredFileDataSource[], { "code": number, "message": string }] {
        const fileDataList = db.prepare("SELECT * FROM file_data;").all()
        return [fileDataList.map(FileDataSourceRepository.castToStoredDataSource), null];
    }

    async deleteDataSource(uuid: string) {
        const [,err] = await this.deleteFromSolr(uuid);
        if (err) {
            return [null, err];
        }
        try {
            db.prepare("DELETE FROM file_data WHERE uuid = ?").run(uuid);
        } catch (e) {
            console.error(e)
            return [null, {
                "code": 404,
                "message": "File datasource not found"
            }];
        }
        return [{
            "code": 204,
            "message": "Successfully deleted File datasource"
        }, null];
    }

    async deleteFromSolr(uuid: string) {
        try {
            await axios.post('http://localhost:' + process.env.SOLR_PORT + '/solr/files/update?commit=true',
                {
                    "delete": {
                        "query": "id:" + uuid
                    }
                }
            );
            return [{
                "code": 204,
                "message": "Successfully removed document from Solr"
            }, null];
        } catch (e) {
            return [null, {
                "code": 500,
                "message": "Could not delete document from solr"
            }]
        }
    }
}

const fileDataSourceRepository = new FileDataSourceRepository();
export default fileDataSourceRepository;