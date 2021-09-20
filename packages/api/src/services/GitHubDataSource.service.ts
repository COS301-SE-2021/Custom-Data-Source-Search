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
import axios, {AxiosResponse} from "axios";
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
        const fs = require('fs');
        if (!await GitHubDataSourceService.repoExists(dataSource.repo, dataSource.token)) {
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
        await fs.mkdir(repoName, (err: any) => {
            if (err) {
                return console.error(err);
            }
        })
        let branchName: string = "master";
        try {
            branchName = (await axios.get(
                "https://api.github.com/repos/" + dataSource.repo + "/branches"
            )).data[0]["name"];
        } catch (e) {
            console.error(e);
        }
        let file = fs.createWriteStream(repoName + "/temp.zip");
        let response: AxiosResponse;
        let config: any = {
            responseType: 'stream'
        };
        if (dataSource.token !== undefined && dataSource.token !== "") {
            config["headers"] = {
                Authorization: "token " + dataSource.token
            };
        }
        try {
            response = await axios.get(
                "https://github.com/" + dataSource.repo + "/archive/refs/heads/" + branchName + ".zip",
                config
            );
            response.data.pipe(file);
            await new Promise(fulfill => file.on("finish", fulfill));
            file.close();
        } catch (e) {
            console.error(e);
        }
        shell.cd(repoName);
        if (process.platform === "win32") {
            shell.exec('tar -xf temp.zip');
        } else {
            shell.exec('unzip temp.zip');
        }
        await fs.rm(
            repoName + "/temp.zip",
            {recursive: true},
            (err: any) => {
                if (err) {
                    console.error(err);
                }
            });
        for (let filePath of this.getFilesInFolder(repoName + "/")) {
            const [fileContent, fileErr] = fileDataSourceService.readFile(filePath);
            if (fileErr) {
                continue;
            }
            const fileFromRepoUUID: string = generateUUID()
            console.log(filePath);
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
        shell.cd("../");
        await fs.rm(
            repoName,
            {recursive: true},
            (err: any) => {
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
            files.push(path + filePath);
        })
        return files;
    }

    getAllFilesRecursively(path: string): string[] {
        let results: string[] = [];
        for (let folderItem of fs.readdirSync(path)) {

            if (fs.lstatSync(path + folderItem).isDirectory()) {
                this.getAllFilesRecursively(path + folderItem + "/").forEach((continuedPath) => {
                    results.push(folderItem + "/" + continuedPath);
                });
            } else if (folderItem.indexOf(".ini") === -1) {
                results.push(folderItem);
            }
        }
        return results;
    }

    private static async repoExists(repo: string, token: string) {
        let config: any = {};
        if (token !== undefined && token !== ""){
            config["headers"] = {
                Authorization: "token " + token
            }
        }
        return axios.get(
            "https://api.github.com/repos/" + repo,
            config)
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });
    }

    getSearchSnippet(snippet: string, dataSourceUUID: string): string {
        const [result, err] = gitHubDataSourceRepository.getFileFromRepo(dataSourceUUID);
        if (err) {
            return snippet;
        }
        const fileName: string = result["file_path"].split("/").pop();
        return fileDataSourceService.getSearchSnippet(snippet, fileName);
    }
}

const gitHubDataSourceService = new GitHubDataSourceService();
export default gitHubDataSourceService;