import {statusMessage} from "../general/generalFunctions";
import {StatusMessage} from "../models/response/general.interfaces";
import {FileFromRepo, GitHubDataSource} from "../models/GitHubDataSource.interface";

const db = require("better-sqlite3")('../../data/datasleuth.db');

class GitHubDataSourceRepository {

    /**
     * Store a new github datasource in db
     *
     * @param {GitHubDataSource} dataSource
     * @return {[StatusMessage, StatusMessage]}
     */
    addDataSource(dataSource: GitHubDataSource): [StatusMessage, StatusMessage] {
        try {
            db.prepare(
                'INSERT INTO github_data (repo, uuid, tag1, tag2, token) VALUES (?, ?, ?, ?, ?);'
            ).run(
                dataSource.repo,
                dataSource.uuid,
                dataSource.tag1,
                dataSource.tag2,
                dataSource.token
            )
        } catch (e) {
            return [null, statusMessage(400, "GitHub datasource already exists")];
        }
        return [statusMessage(200, "Successfully added GitHub datasource"), null];
    }

    /**
     * Add a file that is part of a repository to db
     *
     * @return {[StatusMessage, StatusMessage]}
     * @param fileFromRepo
     */
    addFileInRepo(fileFromRepo: FileFromRepo): [StatusMessage, StatusMessage] {
        try {
            db.prepare(
                'INSERT INTO repo_file_data (file_path, repo_uuid, uuid) VALUES (?, ?, ?);'
            ).run(
                fileFromRepo.filePath,
                fileFromRepo.repoUUID,
                fileFromRepo.UUID
            )
        } catch (e) {
            console.error(e);
            return [null, statusMessage(400, "File from repo already exists")];
        }
        return [statusMessage(200, "Successfully added file from repo"), null];
    }

    /**
     * Retrieve a GitHub datasource stored in db by it's uuid
     *
     * @param {string} uuid
     * @return {[GitHubDataSource, StatusMessage]}
     */
    getDataSource(uuid: string): [GitHubDataSource, StatusMessage] {
        try {
            const dataSource = db.prepare("SELECT * FROM github_data WHERE uuid = ?").get(uuid);
            if (dataSource !== undefined) {
                return [dataSource, null];
            }
            return [null, statusMessage(404, "Datasource not found")];
        } catch (e) {
            return [null, statusMessage(500, "Error with db")];
        }
    }

    /**
     * Return all GitHub datasources
     *
     * @return {[GitHubDataSource[], StatusMessage]}
     */
    getAllDataSources(): [GitHubDataSource[], StatusMessage] {
        try {
            const repoList = db.prepare("SELECT * FROM github_data;").all()
            return [repoList, null];
        } catch (e) {
            return [null, statusMessage(500, "Error with db")];
        }
    }

    /**
     * Delete a GitHub datasource from db by it's uuid
     * @async
     *
     * @param {string} uuid
     * @return {[StatusMessage, StatusMessage]}
     */
    deleteDataSource(uuid: string): [StatusMessage, StatusMessage] {
        try {
            db.prepare("DELETE FROM repo_file_data WHERE repo_uuid = ?").run(uuid);
            db.prepare("DELETE FROM github_data WHERE uuid = ?").run(uuid);
        } catch (e) {
            console.error(e)
            return [null, statusMessage(404, "GitHub datasource not found")];
        }
        return [statusMessage(204, "Successfully deleted GitHub datasource"), null];
    }

    /**
     * Return all the uuids from repo_file_data where the repository uuid is specified
     *
     * @param {string} repoUUID
     * @return {string[]}
     */
    getAllRepoFileUUIDs(repoUUID: string): string[] {
        try {
            return db
                .prepare("SELECT * FROM repo_file_data WHERE repo_uuid = ?;")
                .all(repoUUID)
                .map((repoFile: any) => {
                    return repoFile["uuid"];
                });
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    /**
     * Return GitHub datasource uuid which is associated with the file in the repository
     *
     * @param {string} uuid
     * @return {[any, StatusMessage]}
     */
    getRepoFromFile(uuid: string): [any, StatusMessage] {
        try {
            const dataSource = db.prepare(
                "SELECT * FROM github_data WHERE uuid = (SELECT repo_uuid FROM repo_file_data WHERE uuid = ?)"
            ).all(uuid)[0];
            return [dataSource, null];
        } catch (e) {
            console.error(e);
            return [null, statusMessage(404, "Datasource not found")];
        }
    }
}

const gitHubDataSourceRepository = new GitHubDataSourceRepository();
export default gitHubDataSourceRepository;