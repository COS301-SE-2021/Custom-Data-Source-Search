import folderDataSourceRepository from "../repositories/FolderDataSourceRepository";
import fs from "fs";
import {FolderDataSource, StoredFolderDataSource} from "../models/FolderDataSource.interface";
import fileDataSourceRepository from "../repositories/FileDataSourceRepository";
import {generateDefaultHttpResponse, generateUUID, statusMessage} from "../general/generalFunctions";

class FolderDataSourceService {

    getAllFolderDataSources() {
        let [result, err] = folderDataSourceRepository.getAllDataSources();
        if (err) {
            return generateDefaultHttpResponse(err);
        }
        return {
            "code": 200,
            "body": result
        };
    }

    getFolderDataSource(id: string) {
        let [result, err] = folderDataSourceRepository.getDataSource(id);
        if (err) {
            return generateDefaultHttpResponse(err);
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
        if (!fs.existsSync(dataSource.path)) {
            return generateDefaultHttpResponse(statusMessage(404, "Directory does not exist"));
        }
        const uuid: string = generateUUID();
        const storedFolderDatasource: StoredFolderDataSource = {
            uuid: uuid,
            path: dataSource.path,
            tag1: dataSource.tag1,
            tag2: dataSource.tag2
        }
        let [, e] = folderDataSourceRepository.addDataSource(storedFolderDatasource);
        if (e) {
            return generateDefaultHttpResponse(e);
        }
        try {
            for (let fileName of this.getFilesInFolder(dataSource.path, "folder\n*.pdf")) {
                await folderDataSourceRepository.addFileInFolder(dataSource.path + fileName, uuid);
            }
        } catch (e) {}
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

    getFilesInFolder(path: string, dotIgnore: string) {
        let ignoreFolders: string[] = [];
        let ignoreFiles: string[] = [];
        let ignoreFileTypes: string[] = [];
        for (let line of dotIgnore.split("\n")) {
            if (line === "") {
                continue;
            }
            if (line.indexOf("*") !== -1) {
                ignoreFileTypes.push(line);
            } else if (line.indexOf(".") !== -1) {
                ignoreFiles.push(line);
            } else {
                ignoreFolders.push(line);
            }
        }
        let fileNames: string[] = fs.readdirSync(path);
        let results: string[] = [];
        let [separateFiles,] = fileDataSourceRepository.getAllDataSources();
        fileNames.forEach((file) => {
            if (
                file.indexOf(".") !== -1 &&
                file.indexOf(".ini") === -1 &&
                !separateFiles.some(x => x.filename === file)
            ) {
                results.push(file);
            }
        });
        return results;
    }
}

const folderDataSourceService = new FolderDataSourceService();
export default folderDataSourceService;