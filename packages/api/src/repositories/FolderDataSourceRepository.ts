import {FileInFolder, FolderDataSource, StoredFolderDataSource} from "../models/FolderDataSource.interface";
import {statusMessage} from "../general/generalFunctions";
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
     *
     * @param {FileInFolder} fileInFolder
     * @return {[StatusMessage, StatusMessage]}
     */
    addFileInFolder(fileInFolder: FileInFolder): [StatusMessage, StatusMessage] {
        try {
            db.prepare(
                'INSERT INTO folder_file_data (file_path, last_modified, folder_uuid, uuid) VALUES (?, ?, ?, ?);'
            ).run(
                fileInFolder.filePath,
                fileInFolder.lastModified.getTime(),
                fileInFolder.folderUUID,
                fileInFolder.UUID
            )
        } catch (e) {
            console.error(e);
            return [null, statusMessage(400, "File from folder datasource already exists")];
        }
        return [statusMessage(200, "Successfully added file from folder datasource"), null];
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