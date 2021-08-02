import {StoredFileDataSource, FileDataSource} from "../models/FileDataSource.interface";
import {randomBytes} from "crypto";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";


class FileDataSourceRepository {

    fileDataSourceArray: StoredFileDataSource[];

    constructor() {
        this.fileDataSourceArray = [];
    }

    async addDataSource(dataSource: FileDataSource): Promise<[{ code: number, message: string }, { code: number, message: string }]> {
        this.readFile();
        let index: number = this.fileDataSourceArray.findIndex(x => x.path === dataSource.path && x.filename === dataSource.filename);
        if (index !== -1) {
            return [null, {
                "code": 400,
                "message": "File datasource already exists"
            }];
        }
        const storedDatasource: StoredFileDataSource = {
            uuid: randomBytes(16).toString("hex"),
            filename: dataSource.filename,
            path: dataSource.path,
            lastModified: fs.statSync(dataSource.path + dataSource.filename).mtime
        };
        const [, err] = await this.postToSolr(fs.readFileSync(dataSource.path + dataSource.filename), storedDatasource.uuid, storedDatasource.filename);
        if (err) {
            return [null, err];
        }
        this.fileDataSourceArray.push(storedDatasource);
        fs.writeFileSync('./src/repositories/store/fileDataStore.json', JSON.stringify(this.fileDataSourceArray));
        return [{
            "code": 200,
            "message": "Successfully added file datasource"
        }, null];
    }

    async postToSolr(file: Buffer, id: string, fileName: string) {
        let formData = new FormData();
        formData.append("file", file, fileName);
        try {
            await axios.post('http://localhost:8983/solr/files/update/extract?literal.id=' + id
                + '&commit=true&literal.datasource_type=file',
                formData,
                {
                    headers: {
                        ...formData.getHeaders()
                    }
                });
        } catch (e) {
            return [null, {
                "code": 500,
                "message": "Could not post file to solr"
            }]
        }
        return [{
            "code": 200,
            "message": "Successfully posted to Solr"
        }]
    }

    async updateDatasources() {
        this.readFile();
        for (let storedDatasrouce of this.fileDataSourceArray) {
            let lastModified: Date = fs.statSync(storedDatasrouce.path + storedDatasrouce.filename).mtime;
            if (new Date(storedDatasrouce.lastModified).getTime() !== lastModified.getTime()) {
                let index: number = this.fileDataSourceArray.indexOf(storedDatasrouce);
                storedDatasrouce.lastModified = lastModified;
                this.fileDataSourceArray[index] = storedDatasrouce;
                fs.writeFileSync('./src/repositories/store/fileDataStore.json', JSON.stringify(this.fileDataSourceArray));
                try {
                    await this.postToSolr(fs.readFileSync(storedDatasrouce.path + storedDatasrouce.filename), storedDatasrouce.uuid, storedDatasrouce.filename);
                } catch (e) {
                    console.log("Error posting file to solr");
                }
            }
        }
    }

    getDataSource(uuid: string): [StoredFileDataSource, { "code": number, "message": string }] {
        this.readFile();
        let index: number = this.fileDataSourceArray.findIndex(x => x.uuid === uuid);
        if (index !== -1) {
            return [this.fileDataSourceArray[index], null];
        }
        return [null, {
            "code": 404,
            "message": "Datasource not found"
        }]
    }

    getAllDataSources(): [StoredFileDataSource[], { "code": number, "message": string }] {
        this.readFile();
        return [this.fileDataSourceArray, null];
    }

    updateDataSource(uuid: string, dataSource: FileDataSource) {
        let index: number = this.fileDataSourceArray.findIndex(x => x.uuid === uuid);
        if (index !== -1) {
            this.fileDataSourceArray[index].path = dataSource.path;
            this.fileDataSourceArray[index].filename = dataSource.filename;
            return [{
                "code": 200,
                "message": "Successfully updated datasource"
            }, null]
        }
        return [null, {
            "code": 404,
            "message": "Datasource not found"
        }]
    }

    async deleteDataSource(uuid: string) {
        this.readFile();
        let index: number = this.fileDataSourceArray.findIndex(x => x.uuid === uuid);
        if (index !== -1) {
            this.fileDataSourceArray.splice(index, 1);
            fs.writeFileSync('./src/repositories/store/fileDataStore.json', JSON.stringify(this.fileDataSourceArray));
            const [,err] = await this.deleteFromSolr(uuid);
            if (err) {
                return [null, {
                    "code": 500,
                    "message": "Could not delete document from solr"
                }]
            }
            return [{
                "code": 204,
                "message": "Successfully deleted File datasource"
            }, null]
        }
        return [null, {
            "code": 404,
            "message": "File datasource not found"
        }]
    }

    async deleteFromSolr(uuid: string) {
        try {
            await axios.post('http://localhost:8983/solr/files/update?commit=true',
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

    readFile() {
        try {
            this.fileDataSourceArray = JSON.parse(fs.readFileSync('./src/repositories/store/fileDataStore.json', 'utf-8'));
        } catch (err) {
            this.fileDataSourceArray = [];
        }
    }
}

const fileDataSourceRepository = new FileDataSourceRepository();
export default fileDataSourceRepository;