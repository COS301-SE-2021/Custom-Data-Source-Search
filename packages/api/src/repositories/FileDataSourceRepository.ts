import {StoredFileDataSource, FileDataSource} from "../models/FileDataSource.interface";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import {StatusMessage} from "../models/response/statusMessage.interface";
import {statusMessage} from "../general/generalFunctions";

const db = require("better-sqlite3")('../../data/datasleuth.db');

class FileDataSourceRepository {

    /**
     * Store a new file datasource in db
     *
     * @param {FileDataSource} dataSource
     * @return {[StatusMessage, StatusMessage]}
     */
    addDataSource(dataSource: StoredFileDataSource): [StatusMessage,StatusMessage] {
        try {
            db.prepare(
                'INSERT INTO file_data (uuid, file_path, last_modified, tag1, tag2) VALUES (?, ?, ?, ?, ?);'
            ).run(
                dataSource.uuid,
                dataSource.path + dataSource.filename,
                dataSource.lastModified.getTime(),
                dataSource.tag1,
                dataSource.tag2
            )
        } catch (e) {
            return [null, statusMessage(400, "File datasource already exists")];
        }
        return [statusMessage(200, "Successfully added file datasource"), null];
    }

    /**
     * Remove extension from file name
     *
     * @param {string} fileName
     * @return {string}
     */
    removeExtension(fileName: string) {
        let lastIndex: number = fileName.lastIndexOf(".");
        fileName = fileName.substring(0, lastIndex);
        return fileName;
    }

    /**
     * Post contents of a file to solr
     * @async
     *
     * @param {Buffer} file Content of file
     * @param {string} id Id of datasource as stored in db
     * @param {string} fileName
     * @return {Promise<[{ code: number, message: string }, { code: number, message: string }]>}
     */
    async postToSolr(file: Buffer, id: string, fileName: string) {
        let formData = new FormData();
        fileName = this.removeExtension(fileName);
        formData.append("file", file, fileName);
        try {
            await axios.post(
                'http://localhost:' +
                process.env.SOLR_PORT +
                '/solr/files/update/extract?literal.id=' +
                id +
                '&commit=true&literal.datasource_type=file',
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

    /**
     * Update all documents in solr that have been changed
     * @async
     */
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
                    db.prepare(
                        "UPDATE file_data SET last_modified = ? WHERE uuid = ?"
                    ).run(lastModified, fileData.uuid)
                } catch (e) {
                    console.log("Error posting file to solr");
                }
            }
        }
    }

    /**
     * Retrieve a file datasource stored in db by it's uuid
     *
     * @param {string} uuid
     * @return {[StoredFileDataSource, { code: number, message: string }]}
     */
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

    /**
     * Format file datasource from db to a StoredFileDatasource
     *
     * @param {any} dataSource
     * @return {StoredFileDataSource}
     */
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

    /**
     * Return all stored file datasources
     *
     * @return {[StoredFileDataSource[], { "code": number, "message": string }]}
     */
    getAllDataSources(): [StoredFileDataSource[], { "code": number, "message": string }] {
        const fileDataList = db.prepare("SELECT * FROM file_data;").all()
        return [fileDataList.map(FileDataSourceRepository.castToStoredDataSource), null];
    }

    /**
     * Delete a file datasource from db by it's uuid
     * @async
     *
     * @param {string} uuid
     * @return {Promise<[{ code: number, message: string }, { code: number, message: string }]>}
     */
    async deleteDataSource(uuid: string) {
        const [, err] = await this.deleteFromSolr(uuid);
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

    /**
     * Remove document associated with datasource from solr
     * @async
     *
     * @param {string} uuid
     * @return {Promise<[{ code: number, message: string }, { code: number, message: string }]>}
     */
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