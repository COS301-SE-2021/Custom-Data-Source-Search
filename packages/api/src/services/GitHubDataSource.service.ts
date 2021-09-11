import gitHubDataSourceRepository from "../repositories/GitHubDataSourceRepository";
import fs from "fs";
import {FileInFolder, StoredFolderDataSource} from "../models/FolderDataSource.interface";
import {
    generateDefaultHttpResponse,
    generateUUID, getLastModifiedDateOfFile,
    removeFileExtension,
    statusMessage
} from "../general/generalFunctions";
import {DefaultHttpResponse} from "../models/response/general.interfaces";
import solrService from "./Solr.service";
import fileDataSourceService from "./FileDataSource.service";
import {GitHubDataSource} from "../models/GitHubDataSource.interface";

class GitHubDataSourceService {

    getAllGitHubDataSources() {
        let [result, err] = gitHubDataSourceRepository.getAllDataSources();
        if (err) {
            return generateDefaultHttpResponse(err);
        }
        return {
            "code": 200,
            "body": result
        };
    }

    getGitHubDataSource(id: string) {
        let [result, err] = gitHubDataSourceRepository.getDataSource(id);
        if (err) {
            return generateDefaultHttpResponse(err);
        }
        return {
            "code": 200,
            "body": result
        }
    }

    async addGitHubDataSource(dataSource: GitHubDataSource): Promise<DefaultHttpResponse> {
        const folderUUID: string = generateUUID();
        const storedFolderDatasource: StoredFolderDataSource = {
            uuid: folderUUID,
            path: dataSource.path,
            tag1: dataSource.tag1,
            tag2: dataSource.tag2
        }
        let [, e] = gitHubDataSourceRepository.addDataSource(storedFolderDatasource);
        if (e) {
            return generateDefaultHttpResponse(e);
        }
        for (let filePath of this.getFilesInFolder(dataSource.path, "folderDepth2\n*.pdf", 3)) {
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
            gitHubDataSourceRepository.addFileInFolder(fileInFolder);
        }
        return generateDefaultHttpResponse(statusMessage(200, "Successfully added datasource"));
    }

    extractFileName(filePath: string): string {
        return filePath.split("/").pop();
    }

    async removeFolderDataSource(id: string): Promise<DefaultHttpResponse> {
        for (let folderFileUUID of gitHubDataSourceRepository.getAllFolderFileUUIDs(id)) {
            await solrService.deleteFromSolr(folderFileUUID);
        }
        let [result, err] = gitHubDataSourceRepository.deleteDataSource(id);
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

const folderDataSourceService = new GitHubDataSourceService();
export default folderDataSourceService;