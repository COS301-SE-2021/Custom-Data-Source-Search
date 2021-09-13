import gitHubDataSourceRepository from "../repositories/GitHubDataSourceRepository";
import fs from "fs";
import {
    generateDefaultHttpResponse,
    generateUUID,
    removeFileExtension,
    statusMessage
} from "../general/generalFunctions";
import {DefaultHttpResponse} from "../models/response/general.interfaces";
import solrService from "./Solr.service";
import fileDataSourceService from "./FileDataSource.service";
import {FileFromRepo, GitHubDataSource, StoredGitHubDataSource} from "../models/GitHubDataSource.interface";
import axios from "axios";

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
        if (!await GitHubDataSourceService.repoExists(dataSource.repo)) {
            return generateDefaultHttpResponse(statusMessage(404, "Repo not found"));
        }
        return generateDefaultHttpResponse(statusMessage(200, "Testing success"));
        const repoUUID: string = generateUUID();
        const storedGitHubDatasource: StoredGitHubDataSource = {
            uuid: repoUUID,
            repo: dataSource.repo,
            tag1: dataSource.tag1,
            tag2: dataSource.tag2,
            token: dataSource.token
        }
        let [, e] = gitHubDataSourceRepository.addDataSource(storedGitHubDatasource);
        if (e) {
            return generateDefaultHttpResponse(e);
        }
        for (let filePath of this.getFilesInFolder(__dirname + dataSource.repo, "", 3)) {
            const [fileContent, fileErr] = fileDataSourceService.readFile(filePath);
            if (fileErr) {
                continue;
            }
            const fileFromRepoUUID: string = generateUUID()
            const [, solrErr] = await solrService.postToSolr(
                fileContent, fileFromRepoUUID, removeFileExtension(this.extractFileName(filePath)), "github"
            );
            if (solrErr) {
                continue;
            }
            const fileFromRepo: FileFromRepo = {
                filePath: filePath,
                repoUUID: repoUUID,
                UUID: fileFromRepoUUID
            }
            gitHubDataSourceRepository.addFileInRepo(fileFromRepo);
        }
        return generateDefaultHttpResponse(statusMessage(200, "Successfully added datasource"));
    }

    extractFileName(filePath: string): string {
        return filePath.split("/").pop();
    }

    async removeFolderDataSource(id: string): Promise<DefaultHttpResponse> {
        for (let folderFileUUID of gitHubDataSourceRepository.getAllRepoFileUUIDs(id)) {
            await solrService.deleteFromSolr(folderFileUUID);
        }
        let [result, err] = gitHubDataSourceRepository.deleteDataSource(id);
        if (err) {
            return generateDefaultHttpResponse(err);
        }
        return generateDefaultHttpResponse(result);
    }

    getFilesInFolder(path: string, dotIgnore: string): string[] {
        let files: string[] = [];
        this.getAllFilesRecursively(path).forEach((filePath: string) => {
            if (filePath.indexOf(".") !== -1) {
                return;
            }
            files.push(path + filePath);
        })
        return files;
    }

    getAllFilesRecursively(path: string): string[] {
        let results: string[] = [];
        for (let folderItem of fs.readdirSync(path)) {
            if (folderItem.indexOf(".") === -1) {
                this.getAllFilesRecursively(path + folderItem + "/").forEach((continuedPath) => {
                    results.push(folderItem + "/" + continuedPath);
                });
            } else if (folderItem.indexOf(".ini") === -1) {
                results.push(folderItem);
            }
        }
        return results;
    }

    private static async repoExists(repo: string) {
        return axios.get("https://api.github.com/repos/" + repo)
            .then(() => {return true;})
            .catch(() => {return false;});
    }
}

const folderDataSourceService = new GitHubDataSourceService();
export default folderDataSourceService;