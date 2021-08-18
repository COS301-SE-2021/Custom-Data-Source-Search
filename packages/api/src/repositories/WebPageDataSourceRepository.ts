import {WebPageDataSource} from "../models/WebPageDataSource.interface";
import {randomBytes} from "crypto";
import FormData from "form-data";
import axios from "axios";

const db = require("better-sqlite3")('../../data/datasleuth.db');


class WebPageDataSourceRepository {

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

    async postToSolr(page: string, id: string, url: string) {
        try {
            let content: any = Buffer.from(page);
            let formData = new FormData();
            formData.append("file", content, url);
            await axios.post('http://localhost:8983/solr/files/update/extract?literal.id=' + id
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

    // This code is for updating file datasources based on last modified time, need something else for webpages
    // async updateDatasources() {
    //     this.readFile();
    //     for (let storedDatasrouce of this.webPageDataSourceArray) {
    //         let lastModified: Date = fs.statSync(storedDatasrouce.path + storedDatasrouce.filename).mtime;
    //         if (new Date(storedDatasrouce.lastModified).getTime() !== lastModified.getTime()) {
    //             let index: number = this.fileDataSourceArray.indexOf(storedDatasrouce);
    //             storedDatasrouce.lastModified = lastModified;
    //             this.fileDataSourceArray[index] = storedDatasrouce;
    //             fs.writeFileSync('./store/webPageDataStore.json', JSON.stringify(this.fileDataSourceArray));
    //             try {
    //                 await this.postToSolr(fs.readFileSync(storedDatasrouce.path + storedDatasrouce.filename), storedDatasrouce.uuid, storedDatasrouce.filename);
    //             } catch (e) {
    //                 console.log("Error posting file to solr");
    //             }
    //         }
    //     }
    // }
    // TODO FROM HERE
    // getDataSource(uuid: string): [StoredWebPageDataSource, { "code": number, "message": string }] {
    //     this.readFile();
    //     let index: number = this.webPageDataSourceArray.findIndex(x => x.uuid === uuid);
    //     if (index !== -1) {
    //         return [this.webPageDataSourceArray[index], null];
    //     }
    //     return [null, {
    //         "code": 404,
    //         "message": "Datasource not found"
    //     }]
    // }

    // getAllDataSources(): [StoredWebPageDataSource[], { "code": number, "message": string }] {
    //     this.readFile();
    //     return [this.webPageDataSourceArray, null];
    // }
    //
    // updateDataSource(uuid: string, dataSource: WebPageDataSource) {
    //     let index: number = this.webPageDataSourceArray.findIndex(x => x.uuid === uuid);
    //     if (index !== -1) {
    //         this.webPageDataSourceArray[index].url = dataSource.url;
    //         return [{
    //             "code": 200,
    //             "message": "Successfully updated datasource"
    //         }, null]
    //     }
    //     return [null, {
    //         "code": 404,
    //         "message": "Datasource not found"
    //     }]
    // }

    // deleteDataSource(uuid: string) {
    //     this.readFile();
    //     let index: number = this.webPageDataSourceArray.findIndex(x => x.uuid === uuid);
    //     if (index !== -1) {
    //         this.webPageDataSourceArray.splice(index, 1);
    //         fs.writeFileSync('./store/webPageDataStore.json', JSON.stringify(this.webPageDataSourceArray));
    //         // Solr code to remove document
    //         // const [,err] = await this.deleteFromSolr(uuid);
    //         // if (err) {
    //         //     return [null, {
    //         //         "code": 500,
    //         //         "message": "Could not delete document from solr"
    //         //     }]
    //         // }
    //         return [{
    //             "code": 204,
    //             "message": "Successfully deleted Webpage datasource"
    //         }, null]
    //     }
    //     return [null, {
    //         "code": 404,
    //         "message": "Webpage datasource not found"
    //     }]
    // }

    // function that removes document from solr
    // async deleteFromSolr(uuid: string) {
    //     try {
    //         await axios.post('http://localhost:8983/solr/files/update?commit=true',
    //             {
    //                 "delete": {
    //                     "query": "id:" + uuid
    //                 }
    //             }
    //         );
    //         return [{
    //             "code": 204,
    //             "message": "Successfully removed document from Solr"
    //         }, null];
    //     } catch (e) {
    //         return [null, {
    //             "code": 500,
    //             "message": "Could not delete document from solr"
    //         }]
    //     }
    // }

    // readFile() {
    //     try {
    //         this.webPageDataSourceArray = JSON.parse(fs.readFileSync('./store/webPageDataStore.json', 'utf-8'));
    //     } catch (err) {
    //         this.webPageDataSourceArray = [];
    //     }
    // }
}

const webPageDataSourceRepository = new WebPageDataSourceRepository();
export default webPageDataSourceRepository;