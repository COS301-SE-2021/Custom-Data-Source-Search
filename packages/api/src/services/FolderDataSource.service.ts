import folderDataSourceRepository from "../repositories/FolderDataSourceRepository";
import fs from "fs";
import {FileInFolder, FolderDataSource, StoredFolderDataSource} from "../models/FolderDataSource.interface";
import fileDataSourceRepository from "../repositories/FileDataSourceRepository";
import {
    generateDefaultHttpResponse,
    generateUUID, getLastModifiedDateOfFile,
    removeFileExtension,
    statusMessage
} from "../general/generalFunctions";
import {DefaultHttpResponse} from "../models/response/general.interfaces";
import solrService from "./Solr.service";
import fileDataSourceService from "./FileDataSource.service";

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
            "body": result
        }
    }

    async addFolderDataSource(dataSource: FolderDataSource): Promise<DefaultHttpResponse> {
        if (dataSource.path[dataSource.path.length - 1] !== '/') {
            dataSource.path += '/';
        }
        if (!fs.existsSync(dataSource.path)) {
            return generateDefaultHttpResponse(statusMessage(404, "Directory does not exist"));
        }
        if (dataSource.dotIgnore === undefined) {
            dataSource.dotIgnore = "";
        }
        if (dataSource.depth === undefined) {
            dataSource.depth = 10;
        }
        const folderUUID: string = generateUUID();
        const storedFolderDatasource: StoredFolderDataSource = {
            uuid: folderUUID,
            path: dataSource.path,
            tag1: dataSource.tag1,
            tag2: dataSource.tag2,
            dotIgnore: dataSource.dotIgnore
        }
        let [, e] = folderDataSourceRepository.addDataSource(storedFolderDatasource);
        if (e) {
            return generateDefaultHttpResponse(e);
        }
        for (let filePath of this.getFilesInFolder(dataSource.path, dataSource.dotIgnore, dataSource.depth)) {
            const [fileContent, fileErr] = fileDataSourceService.readFile(filePath);
            if (fileErr) {
                continue;
            }
            const fileInFolderUUID: string = generateUUID()
            const [, solrErr] = await solrService.postToSolr(
                fileContent, fileInFolderUUID, removeFileExtension(this.extractFileName(filePath)), "folder"
            );
            if (solrErr) {
                continue;
            }
            const fileInFolder: FileInFolder = {
                filePath: filePath,
                lastModified: getLastModifiedDateOfFile(filePath),
                folderUUID: folderUUID,
                UUID: fileInFolderUUID
            }
            folderDataSourceRepository.addFileInFolder(fileInFolder);
        }
        return generateDefaultHttpResponse(statusMessage(200, "Successfully added datasource"));
    }

    extractFileName(filePath: string): string {
        return filePath.split("/").pop();
    }

    async removeFolderDataSource(id: string): Promise<DefaultHttpResponse> {
        for (let folderFileUUID of folderDataSourceRepository.getAllFolderFileUUIDs(id)) {
            await solrService.deleteFromSolr(folderFileUUID);
        }
        let [result, err] = folderDataSourceRepository.deleteDataSource(id);
        if (err) {
            return generateDefaultHttpResponse(err);
        }
        return generateDefaultHttpResponse(result);
    }

    getFilesInFolder(path: string, dotIgnore: string, depth: number): string[] {
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
            if (filePath.indexOf(".") === -1) {
                return;
            }
            files.push(path + filePath);
        });
        return files;
    }

    getAllFilesRecursively(path: string, ignoreFolders: string[], depth: number): string[] {
        if (depth < 0) {
            return []
        }
        let results: string[] = [];
        for (let folderItem of fs.readdirSync(path)) {
            if (fs.lstatSync(path + folderItem).isDirectory() && ignoreFolders.indexOf(folderItem) === -1) {
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

    getSearchSnippet(snippet: string, dataSourceUUID: string): string {
        const [result, err] = folderDataSourceRepository.getFileInFolder(dataSourceUUID);
        if (err) {
            return snippet;
        }
        const fileName: string = result["file_path"].split("/").pop();
        return fileDataSourceService.getSearchSnippet(snippet, fileName);
    }
}

const folderDataSourceService = new FolderDataSourceService();
export default folderDataSourceService;