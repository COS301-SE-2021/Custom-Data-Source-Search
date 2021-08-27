import fs from "fs";
import {FolderDataSource, StoredFolderDataSource} from "../models/FolderDataSource.interface";
import FormData from "form-data";
import axios from "axios";
import {generateUUID, removeFileExtension, statusMessage} from "../general/generalFunctions";
import solrService from "../services/Solr.service";
import {StatusMessage} from "../models/response/general.interfaces";

const db = require("better-sqlite3")('../../data/datasleuth.db');

class FolderDataSourceRepository {

    /**
     * Store a new folder datasource in db
     *
     * @param {FolderDataSource} dataSource
     * @return {[StatusMessage, StatusMessage]}
     */
    addDataSource(dataSource: StoredFolderDataSource): [StatusMessage, StatusMessage] {
        try {
            db.prepare(
                'INSERT INTO folder_data (folder_name, path, uuid, tag1, tag2, dot_ignore) VALUES (?, ?, ?, ?, ?, ?);'
            ).run(
                FolderDataSourceRepository.getFolderName(dataSource.path),
                dataSource.path,
                dataSource.uuid,
                dataSource.tag1,
                dataSource.tag2,
                "ignore certain files"
            )
        } catch (e) {
            return [null, statusMessage(400, "Folder datasource already exists")];
        }
        return [statusMessage(200, "Successfully added file datasource"), null];
    }

    /**
     * Add a file contained in a folder to db and post it's contents to solr
     * @async
     *
     * @param {string} filePath Complete path to file
     * @param {string} folderUUID uuid of corresponding folder that file is contained in
     * @return {Promise<[{ code: number, message: string }, { code: number, message: string }]>}
     */
    async addFileInFolder(filePath: string, folderUUID: string) {
        const uuid: string = generateUUID()
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

    /**
     * Retrieve a folder datasource stored in db by it's uuid
     *
     * @param {string} uuid
     * @return {[StoredFolderDataSource, StatusMessage]}
     */
    getDataSource(uuid: string): [StoredFolderDataSource, StatusMessage] {
        try {
            const dataSource = db.prepare("SELECT * FROM folder_data WHERE uuid = ?").get(uuid);
            if (dataSource !== undefined) {
                return [FolderDataSourceRepository.castToStoredDataSource(dataSource), null];
            }
            return [null, statusMessage(404, "Datasource not found")];
        } catch (e) {
            return [null, statusMessage(500, "Error with db")];
        }
    }

    /**
     * Return all stored folder datasources
     *
     * @return {[StoredFolderDataSource[], StatusMessage]}
     */
    getAllDataSources(): [StoredFolderDataSource[], StatusMessage] {
        try {
            const fileDataList = db.prepare("SELECT * FROM folder_data;").all()
            return [fileDataList.map(FolderDataSourceRepository.castToStoredDataSource), null];
        } catch (e) {
            return [null, statusMessage(500, "Error with db")];
        }
    }

    /**
     * Delete a folder datasource from db by it's uuid
     * @async
     *
     * @param {string} uuid
     * @return {Promise<[{ code: number, message: string }, { code: number, message: string }]>}
     */
    async deleteDataSource(uuid: string) {
        try {
            for (let folderFile of db.prepare("SELECT * FROM folder_file_data WHERE folder_uuid = ?;").all(uuid)) {
                await solrService.deleteFromSolr(folderFile["uuid"]);
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

    /**
     * Return deepest folder specified in a path
     *
     * @param {string} path
     * @return {string}
     */
    private static getFolderName(path: string) {
        return path.substr(0, path.length - 1).split("/").pop();
    }

    /**
     * Format folder datasource from db to a StoredFolderDatasource
     *
     * @param {any} dataSource
     * @return {StoredFolderDataSource}
     */
    private static castToStoredDataSource(dataSource: any): StoredFolderDataSource {
        if (dataSource === undefined) {
            return undefined;
        }
        return {
            uuid: dataSource.uuid,
            path: dataSource.path,
            tag1: dataSource.tag1,
            tag2: dataSource.tag2
        };
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
        fileName = removeFileExtension(fileName);
        formData.append("file", file, fileName);
        try {
            await axios.post(
                'http://localhost:' +
                process.env.SOLR_PORT +
                '/solr/files/update/extract?literal.id=' +
                id +
                '&commit=true&literal.datasource_type=folder',
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

    /**
     * Return file name from path
     *
     * @param {string} filePath
     * @return {string}
     */
    private static getFileName(filePath: string) {
        return filePath.split("/").pop();
    }

    /**
     * Return folder datasource which is associated with the file in the folder
     *
     * @param {string} uuid
     * @return {string}
     */
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