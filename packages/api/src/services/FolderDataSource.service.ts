import folderDataSourceRepository from "../repositories/FolderDataSourceRepository";
import fs from "fs";
import {FolderDataSource} from "../models/FolderDataSource.interface";
import textDataSourceRepository from "../repositories/TextDataSourceRepository";
import {StringOccurrencesResponse} from "../models/response/searchFileResponse.interface";
import textDataSourceService from "./TextDataSource.service";

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
        if (path[path.length - 1] !== '/') {
            path += '/';
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

    async searchAllFolderDataSources(searchString: string) {
        // TODO make this right
        let [data] = folderDataSourceRepository.getAllDataSources();
        // Above this is placeholder implementation
        let files: string[] = [];
        let paths: string[] = [];
        data.forEach((storedFile) => {
            let temp: string[] = this.getFilesInFolder(storedFile.path);
            files = files.concat(temp);
            for (let i = 0; i < temp.length; i++) {
                paths.push(storedFile.path);
            }
        });
        let result: StringOccurrencesResponse = {};
        let file: Promise<string>[] = [];
        for (let i = 0; i < files.length; i++) {
            let location = paths[i] + files[i];
            file.push(textDataSourceService.readFile(location));
        }
        let i = 0;
        for await (const content of file) {
            result[i] = {
                type: "folder",
                fileName: files[i],
                occurrences: textDataSourceService.searchFile(content, searchString)
            };
            i++;
        }
        return [result, null];
    }

    getFilesInFolder(path: string) {
        let fileNames: string[] = fs.readdirSync(path);
        let results: string[] = [];
        let [separateFiles, ] = textDataSourceRepository.getAllDataSources();
        fileNames.forEach((file) => {
            if (file.indexOf('.txt') !== -1 && separateFiles.findIndex(x => x.filename === file) === -1) {
                results.push(file);
            }
        });
        return results;
    }
}

const folderDataSourceService = new FolderDataSourceService();
export default folderDataSourceService;