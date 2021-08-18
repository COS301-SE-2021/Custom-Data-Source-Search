import folderDataSourceRepository from "../repositories/FolderDataSourceRepository";
import fs from "fs";
import {FolderDataSource} from "../models/FolderDataSource.interface";
import fileDataSourceRepository from "../repositories/FileDataSourceRepository";
import {FileOccurrence, StringOccurrence} from "../models/response/searchFileResponse.interface";
import fileDataSourceService from "./FileDataSource.service";

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
        for (let filePath of this.getFilesInFolder(dataSource.path)) {
            await folderDataSourceRepository.addFileInFolder(filePath, result.uuid);
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

    async searchAllFolderDataSources(searchString: string): Promise<[FileOccurrence[], Error]> {
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
            filePromises.push(fileDataSourceService.readFile(location));
        }
        let file: string[];
        file = await Promise.all(filePromises.map((promise) =>
            promise.catch(() => {
                return "";
            })));
        let i = 0;
        let result: FileOccurrence[] = [];
        for (const content of file) {
            let searchResults: StringOccurrence[] = fileDataSourceService.searchFile(content, searchString);
            if (searchResults.length > 0) {
                result.push({
                    type: "folder",
                    source: paths[i] + files[i],
                    match_snippets: searchResults
                });
                i++;
            }
        }
        return [result, null];
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