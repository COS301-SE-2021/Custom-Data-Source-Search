import {StoredFileDataSource, FileDataSource} from "../models/FileDataSource.interface";
import {StatusMessage} from "../models/response/general.interfaces";
import {statusMessage} from "../general/generalFunctions";

const db = require("better-sqlite3")('../../data/datasleuth.db');

class FileDataSourceRepository {

    /**
     * Store a new file datasource in db
     *
     * @param {FileDataSource} dataSource
     * @return {[StatusMessage, StatusMessage]}
     */
    addDataSource(dataSource: StoredFileDataSource): [StatusMessage, StatusMessage] {
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
     * Retrieve a file datasource stored in db by it's uuid
     *
     * @param {string} uuid
     * @return {[StoredFileDataSource, StatusMessage]}
     */
    getDataSource(uuid: string): [StoredFileDataSource, StatusMessage] {
        try {
            const dataSource = db.prepare("SELECT * FROM file_data WHERE uuid = ?").get(uuid)
            if (dataSource !== undefined) {
                return [FileDataSourceRepository.castToStoredDataSource(dataSource), null];
            }
            return [null, statusMessage(404, "Datasource not found")];
        } catch (e) {
            return [null, statusMessage(500, "Error with db")];
        }
    }

    /**
     * Format file datasource from db to a StoredFileDatasource
     *
     * @param {any} dataSource
     * @return {StoredFileDataSource}
     */
    private static castToStoredDataSource(dataSource: any): StoredFileDataSource {
        if (dataSource === undefined) {
            return undefined;
        }
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
     * @return {[StoredFileDataSource[], StatusMessage]}
     */
    getAllDataSources(): [StoredFileDataSource[], StatusMessage] {
        try {
            const fileDataList = db.prepare("SELECT * FROM file_data;").all();
            return [fileDataList.map(FileDataSourceRepository.castToStoredDataSource), null];
        } catch (e) {
            return [null, statusMessage(500, "Error with db")];
        }
    }

    /**
     * Delete a file datasource from db by it's uuid
     * @async
     *
     * @param {string} uuid
     * @return {Promise<[StatusMessage, StatusMessage]>}
     */
    deleteDataSource(uuid: string): [StatusMessage, StatusMessage] {
        try {
            db.prepare("DELETE FROM file_data WHERE uuid = ?").run(uuid);
        } catch (e) {
            return [null, statusMessage(404, "File datasource not found")];
        }
        return [statusMessage(204, "Successfully deleted File datasource"), null];
    }

    updateLastModified(uuid: string, lastModified: number) {
        try {
            db.prepare(
                "UPDATE file_data SET last_modified = ? WHERE uuid = ?"
            ).run(lastModified, uuid);
        } catch (e) {
        }
    }
}

const fileDataSourceRepository = new FileDataSourceRepository();
export default fileDataSourceRepository;