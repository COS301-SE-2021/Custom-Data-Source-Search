import {StoredFileDataSource, FileDataSource} from "../models/FileDataSource.interface";
import {randomBytes} from "crypto";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
const db = require("better-sqlite3")('../../data/datasleuth.db');



class FileDataSourceRepository {
    fileDataSourceArray: StoredFileDataSource[];

    constructor() {
        this.fileDataSourceArray = [];
    }

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
            await axios.post('http://localhost:8983/solr/files/update/extract?literal.id=' + id
                + '&commit=true&literal.datasource_type=file',
                formData,
                {
                    headers: {
                        ...formData.getHeaders()
                    }
                });
        } catch (e) {
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
                db.prepare("UPDATE file_data SET last_modified = ? WHERE uuid = ?").run(lastModified, fileData.uuid)
                try {
                    console.log(fs.readFileSync(fileData.file_path).toString())
                    await this.postToSolr(
                        fs.readFileSync(fileData.file_path),
                        fileData.uuid,
                        fileData.file_path.split("/").pop()
                    );
                } catch (e) {
                    console.log("Error posting file to solr");
                }
            }
        }
    }

    getDataSource(uuid: string): [StoredFileDataSource, { "code": number, "message": string }] {
        this.readFile();
        let index: number = this.fileDataSourceArray.findIndex(x => x.uuid === uuid);
        if (index !== -1) {
            return [this.fileDataSourceArray[index], null];
        }
        return [null, {
            "code": 404,
            "message": "Datasource not found"
        }]
    }

    getAllDataSources(): [StoredFileDataSource[], { "code": number, "message": string }] {
        this.readFile();
        return [this.fileDataSourceArray, null];
    }

    updateDataSource(uuid: string, dataSource: FileDataSource) {
        let index: number = this.fileDataSourceArray.findIndex(x => x.uuid === uuid);
        if (index !== -1) {
            this.fileDataSourceArray[index].path = dataSource.path;
            this.fileDataSourceArray[index].filename = dataSource.filename;
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

    async deleteDataSource(uuid: string) {
        this.readFile();
        let index: number = this.fileDataSourceArray.findIndex(x => x.uuid === uuid);
        if (index !== -1) {
            this.fileDataSourceArray.splice(index, 1);
            fs.writeFileSync('./store/fileDataStore.json', JSON.stringify(this.fileDataSourceArray));
            const [,err] = await this.deleteFromSolr(uuid);
            if (err) {
                return [null, {
                    "code": 500,
                    "message": "Could not delete document from solr"
                }]
            }
            return [{
                "code": 204,
                "message": "Successfully deleted File datasource"
            }, null]
        }
        return [null, {
            "code": 404,
            "message": "File datasource not found"
        }]
    }

    async deleteFromSolr(uuid: string) {
        try {
            await axios.post('http://localhost:8983/solr/files/update?commit=true',
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

    readFile() {
        try {
            this.fileDataSourceArray = JSON.parse(fs.readFileSync('./store/fileDataStore.json', 'utf-8'));
        } catch (err) {
            this.fileDataSourceArray = [];
        }
    }
}

const fileDataSourceRepository = new FileDataSourceRepository();
export default fileDataSourceRepository;