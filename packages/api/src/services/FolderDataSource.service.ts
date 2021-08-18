import folderDataSourceRepository from "../repositories/FolderDataSourceRepository";
import fs from "fs";
import {FolderDataSource} from "../models/FolderDataSource.interface";
import fileDataSourceRepository from "../repositories/FileDataSourceRepository";

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

    async addFolderDataSource(dataSource: FolderDataSource) {
        if (dataSource.path[dataSource.path.length - 1] !== '/') {
            dataSource.path += '/';
        }
        let [result, e] = folderDataSourceRepository.addDataSource(dataSource);
        if (e) {
            return {
                "code": e.code,
                "body": {
                    "message": e.message
                }
            }
        }
        for (let fileName of this.getFilesInFolder(dataSource.path)) {
            await folderDataSourceRepository.addFileInFolder(dataSource.path + fileName, result.uuid);
        }
        return {
            "code": 200,
            "body": {
                "message": "Successfully added datasource"
            }
        }
    }

    async removeFolderDataSource(id: string) {
        let [result, err] = await folderDataSourceRepository.deleteDataSource(id);
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

    getFilesInFolder(path: string) {
        let fileNames: string[] = fs.readdirSync(path);
        let results: string[] = [];
        let [separateFiles,] = fileDataSourceRepository.getAllDataSources();
        fileNames.forEach((file) => {
            if (file.indexOf(".") !== -1 && file.indexOf(".ini") == -1 && !separateFiles.some(x => x.filename === file)) {
                results.push(file);
            }
        });
        return results;
    }
}

const folderDataSourceService = new FolderDataSourceService();
export default folderDataSourceService;