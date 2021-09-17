import gitHubDataSourceRepository from "../repositories/GitHubDataSourceRepository";
import folderDataSourceService from "./FolderDataSource.service";
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
import shell from "shelljs";
import path from "path";

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
        const repoUUID: string = generateUUID();
        const storedGitHubDatasource: StoredGitHubDataSource = {
            uuid: repoUUID,
            repo: dataSource.repo,
            tag1: dataSource.tag1,
            tag2: dataSource.tag2,
            token: dataSource.token
        };
        let [, e] = gitHubDataSourceRepository.addDataSource(storedGitHubDatasource);
        if (e) {
            return generateDefaultHttpResponse(e);
        }
        const repoName: string = path.join(__dirname, dataSource.repo.split("/").pop());
        await fs.mkdir(repoName, (err) => {
            if (err) {
                return console.error(err);
            }
        })
        shell.cd(repoName);
        shell.exec('git clone https://github.com/' + dataSource.repo);
        for (let filePath of this.getFilesInFolder(repoName + "/")) {
            const [fileContent, fileErr] = fileDataSourceService.readFile(filePath);
            if (fileErr) {
                continue;
            }
            const fileFromRepoUUID: string = generateUUID()
            const [, solrErr] = await solrService.postToSolr(
                fileContent,
                fileFromRepoUUID,
                removeFileExtension(folderDataSourceService.extractFileName(filePath)),
                "github"
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
        shell.cd(__dirname);
        await fs.rm(
            repoName,
            {recursive: true},
            (err) => {
                if (err) {
                    console.error("Unable to delete directory");
                    console.error(err);
                }
            });
        return generateDefaultHttpResponse(statusMessage(200, "Successfully added datasource"));
    }

    async removeGitHubDataSource(id: string): Promise<DefaultHttpResponse> {
        for (let folderFileUUID of gitHubDataSourceRepository.getAllRepoFileUUIDs(id)) {
            await solrService.deleteFromSolr(folderFileUUID);
        }
        let [result, err] = gitHubDataSourceRepository.deleteDataSource(id);
        if (err) {
            return generateDefaultHttpResponse(err);
        }
        return generateDefaultHttpResponse(result);
    }

    getFilesInFolder(path: string): string[] {
        let files: string[] = [];
        this.getAllFilesRecursively(path).forEach((filePath: string) => {
            if (filePath.indexOf(".") === -1 || filePath.indexOf(".git") !== -1) {
                return;
            }
            files.push(path + "\\" + filePath);
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
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });
    }
}

const gitHubDataSourceService = new GitHubDataSourceService();
export default gitHubDataSourceService;