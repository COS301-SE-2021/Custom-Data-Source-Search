import {StoredWebPageDataSource, WebPageDataSource} from "../models/WebPageDataSource.interface";
import {randomBytes} from "crypto";
import FormData from "form-data";
import axios from "axios";

const db = require("better-sqlite3")('../../data/datasleuth.db');


class WebPageDataSourceRepository {

    /**
     * Store a new webpage datasource in db and post the contents to solr
     * @async
     *
     * @param {WebPageDataSource} dataSource
     * @param {string} page
     * @return {Promise<[{ code: number, message: string }, { code: number, message: string }]>}
     */
    async addDataSource(dataSource: WebPageDataSource, page: string): Promise<[{ code: number, message: string }, { code: number, message: string }]> {
        const uuid: string = randomBytes(16).toString("hex")
        try {
            db.prepare(
                'INSERT INTO webpage_data (uuid, url, tag1, tag2) VALUES (?,?,?,?);'
            ).run(
                uuid,
                dataSource.url,
                dataSource.tag1,
                dataSource.tag2
            )
        } catch (e) {
            return [null, {
                "code": 400,
                "message": "Webpage datasource already exists"
            }];
        }
        const [, err] = await this.postToSolr(page, uuid, dataSource.url);
        if (err) {
            try {
                db.prepare("DELETE FROM webpage_data WHERE uuid = ?").run(uuid);
            } catch (e) {}
            return [null, err];
        }
        return [{
            "code": 200,
            "message": "Successfully added webpage datasource"
        }, null];
    }

    /**
     * Post contents of a webpage to solr
     * @async
     *
     * @param {string} page Content of webpage
     * @param {string} id Id of datasource as stored in db
     * @param {string} url url of the webpage
     * @return {Promise<[{ code: number, message: string }, { code: number, message: string }]>}
     */
    async postToSolr(page: string, id: string, url: string) {
        try {
            let content: any = Buffer.from(page);
            let formData = new FormData();
            formData.append("file", content, url);
            await axios.post('http://localhost:' + process.env.SOLR_PORT + '/solr/files/update/extract?literal.id=' + id
                + '&commit=true&literal.datasource_type=webpage',
                formData,
                {
                    headers: {
                        ...formData.getHeaders()
                    }
                });
        } catch (e) {
            return [null, {
                "code": 500,
                "message": "Could not post webpage to solr"
            }]
        }
        return [{
            "code": 200,
            "message": "Successfully posted to Solr"
        }]
    }

    /**
     * Retrieve a webpage datasource stored in db by it's uuid
     *
     * @param {string} uuid
     * @return {[StoredWebPageDataSource, { code: number, message: string }]}
     */
    getDataSource(uuid: string): [StoredWebPageDataSource, { "code": number, "message": string }] {
        const dataSource = db.prepare("SELECT * FROM webpage_data WHERE uuid = ?;").get(uuid)
        if (dataSource !== undefined) {
            return [dataSource, null];
        }
        return [null, {
            "code": 404,
            "message": "Datasource not found"
        }]
    }

    /**
     * Return all stored webpage datasources
     *
     * @return {[StoredWebPageDataSource[], { "code": number, "message": string }]}
     */
    getAllDataSources(): [StoredWebPageDataSource[], { "code": number, "message": string }] {
        const webpageDataList = db.prepare("SELECT * FROM webpage_data;").all()
        return [webpageDataList, null];
    }

    /**
     * Delete a webpage datasource from db by it's uuid
     * @async
     *
     * @param {string} uuid
     * @return {Promise<[{ code: number, message: string }, { code: number, message: string }]>}
     */
    async deleteDataSource(uuid: string) {
        const [,err] = await this.deleteFromSolr(uuid);
        if (err) {
            return [null, err];
        }
        try {
            db.prepare("DELETE FROM webpage_data WHERE uuid = ?").run(uuid);
        } catch (e) {
            console.error(e)
            return [null, {
                "code": 404,
                "message": "Webpage datasource not found"
            }];
        }
        return [{
            "code": 204,
            "message": "Successfully deleted webpage datasource"
        }, null];
    }

    /**
     * Remove document associated with datasource from solr
     * @async
     *
     * @param {string} uuid
     * @return {Promise<[{ code: number, message: string }, { code: number, message: string }]>}
     */
    async deleteFromSolr(uuid: string) {
        try {
            await axios.post('http://localhost:' + process.env.SOLR_PORT + '/solr/files/update?commit=true',
                {
                    "delete": {
                        "query": "id:" + uuid
                    }
                }
            );
            return [{
                "code": 204,
                "message": "Successfully removed document from Solr"
            }, null];
        } catch (e) {
            return [null, {
                "code": 500,
                "message": "Could not delete document from solr"
            }]
        }
    }
}

const webPageDataSourceRepository = new WebPageDataSourceRepository();
export default webPageDataSourceRepository;