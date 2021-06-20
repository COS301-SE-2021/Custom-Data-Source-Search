import folderDataSourceRepository from "../repositories/FolderDataSourceRepository";
import fs from "fs";
import {FolderDataSource} from "../models/FolderDataSource.interface";

class FolderDataSourceService {

    getAllFolderDataSources() {
        let [result, err] = folderDataSourceRepository.getAllDataSources();
        if (err) {
            return {
                "code": 500,
                "body": {
                    "message": "Internal error"
                }
            }
        }
        return {
            "code": 200,
            "body": result
        };
    }

    getFolderDataSource(id: string) {
        let [result, err] = folderDataSourceRepository.getDataSource(id);
        if (err) {
            return {
                "code": err.code,
                "body": {
                    "message": err.message
                }
            }
        }
        return {
            "code": 200,
            "body": {
                "message": "Success",
                "data": result
            }
        }
    }

    addFolderDataSource(path: string) {
        if (path[path.length - 1] === '/') {
            path = path.slice(0, path.length - 1);
        }
        if (!fs.existsSync(path)) {
            return {
                "code": 404,
                "body": {
                    "message": "Directory does not exist"
                }
            }
        }
        const temp: FolderDataSource = {path: path};
        let [, e] = folderDataSourceRepository.addDataSource(temp);
        if (e) {
            return {
                "code": 400,
                "body": {
                    "message": "Datasource already exists"
                }
            }
        }
        return {
            "code": 200,
            "body": {
                "message": "Successfully added datasource"
            }
        }
    }

    removeFolderDataSource(id: string) {
        let [result, err] = folderDataSourceRepository.deleteDataSource(id);
        if (err) {
            return {
                "code": err.code,
                "body": {
                    "message": err.message
                }
            }
        }
        return {
            "code": 204,
            "body": {
                "message": result.message
            }
        }
    }
}

const folderDataSourceService = new FolderDataSourceService();
export default folderDataSourceService;