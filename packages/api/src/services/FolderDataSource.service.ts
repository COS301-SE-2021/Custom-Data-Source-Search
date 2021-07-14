import folderDataSourceRepository from "../repositories/FolderDataSourceRepository";
import fs from "fs";
import {FolderDataSource} from "../models/FolderDataSource.interface";
import textDataSourceRepository from "../repositories/TextDataSourceRepository";
import {FileOccurrence, StringOccurrence} from "../models/response/searchFileResponse.interface";
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
        const temp: FolderDataSource = {path: path};
        let [, e] = folderDataSourceRepository.addDataSource(temp);
        if (e) {
            return {
                "code": e.code,
                "body": {
                    "message": e.message
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
        let filePromises: Promise<string>[] = [];
        for (let i = 0; i < files.length; i++) {
            let location = paths[i] + files[i];
            filePromises.push(textDataSourceService.readFile(location));
        }
        let file: string[];
        file = await Promise.all(filePromises.map((promise) =>
            promise.catch(() => {
                return "";
            })));
        let i = 0;
        let result: FileOccurrence[] = [];
        for (const content of file) {
            let searchResults: StringOccurrence[] = textDataSourceService.searchFile(content, searchString);
            if (searchResults.hasOwnProperty('0')) {
                result.push({
                    type: "folder",
                    source: paths[i] + files[i],
                    occurrences: searchResults
                });
                i++;
            }
        }
        return [result, null];
    }

    getFilesInFolder(path: string) {
        let fileNames: string[] = fs.readdirSync(path);
        let results: string[] = [];
        let [separateFiles,] = textDataSourceRepository.getAllDataSources();
        fileNames.forEach((file) => {
            if (file.indexOf(".") !== -1 && !separateFiles.some(x => x.filename === file)) {
                results.push(file);
            }
        });
        return results;
    }
}

const folderDataSourceService = new FolderDataSourceService();
export default folderDataSourceService;