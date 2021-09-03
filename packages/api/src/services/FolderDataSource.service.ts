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
            for (let fileName of this.getFilesInFolder(dataSource.path, "folderDepth2\n*.pdf", 3)) {
                await folderDataSourceRepository.addFileInFolder(fileName, uuid);
            }
        } catch (e) {
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

    getFilesInFolder(path: string, dotIgnore: string, depth: number) {
        let ignoreFolders: string[] = [];
        let ignoreFiles: string[] = [];
        let ignoreFileTypes: string[] = [];
        for (let line of dotIgnore.split("\n")) {
            if (line === "") {
                continue;
            }
            if (line.indexOf("*") !== -1) {
                ignoreFileTypes.push(line.replace("*", ""));
            } else if (line.indexOf(".") !== -1) {
                ignoreFiles.push(line);
            } else {
                ignoreFolders.push(line);
            }
        }
        let [separateFiles,] = fileDataSourceRepository.getAllDataSources();
        let files: string[] = [];
        this.getAllFilesRecursively(path, ignoreFolders, depth).forEach((filePath: string) => {
            if (ignoreFileTypes.indexOf("." + filePath.split(".").pop()) !== -1) {
                return;
            }
            if (ignoreFiles.indexOf(path + filePath) !== -1) {
                return;
            }
            if (separateFiles.some(x => {
                return path + filePath === x.path + x.filename;
            })) {
                return;
            }
            if (filePath.indexOf(".") !== -1) {
                return;
            }
            files.push(path + filePath);
        })
        return files;
    }

    getAllFilesRecursively(path: string, ignoreFolders: string[], depth: number): string[] {
        if (depth < 0) {
            return []
        }
        let results: string[] = [];
        for (let folderItem of fs.readdirSync(path)) {
            if (folderItem.indexOf(".") === -1 && ignoreFolders.indexOf(folderItem) === -1) {
                this.getAllFilesRecursively(
                    path + folderItem + "/",
                    ignoreFolders,
                    depth - 1
                ).forEach((continuedPath) => {
                    results.push(folderItem + "/" + continuedPath);
                })
            } else if (folderItem.indexOf(".ini") === -1) {
                results.push(folderItem);
            }
        }
        return results;
    }
}

const folderDataSourceService = new FolderDataSourceService();
export default folderDataSourceService;