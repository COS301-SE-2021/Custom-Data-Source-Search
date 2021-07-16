import {StoredTextDataSource, TextDataSource} from "../models/TextDataSource.interface";
import {randomBytes} from "crypto";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";


class TextDataSourceRepository {

    textDataSourceArray: StoredTextDataSource[];

    constructor() {
        this.textDataSourceArray = [];
    }

    async addDataSource(dataSource: TextDataSource): Promise<[{code: number, message: string}, {code: number, message: string}]> {
        this.readFile()
        let index: number = this.textDataSourceArray.findIndex(x => x.path === dataSource.path && x.filename === dataSource.filename);
        if (index !== -1) {
            return [null, {
                "code": 400,
                "message": "Text datasource already exists"
            }];
        }
        const storedDatasource: StoredTextDataSource = {
            uuid: randomBytes(16).toString("hex"),
            filename: dataSource.filename,
            path: dataSource.path,
            lastModified: fs.statSync(dataSource.path + dataSource.filename).mtime
        };
        const [, err] = await this.postToSolr(fs.readFileSync(dataSource.path + dataSource.filename), storedDatasource.uuid, storedDatasource.filename);
        if (err) {
            return [null, err];
        }
        this.textDataSourceArray.push(storedDatasource);
        fs.writeFileSync('./src/repositories/store/textDataStore.json', JSON.stringify(this.textDataSourceArray));
        return [{
            "code": 200,
            "message": "Successfully added text datasource"
        }, null];
    }

    async postToSolr(file: Buffer, id: string, fileName: string) {
        let formData = new FormData();
        formData.append("file", file, fileName);
        try {
            await axios.post('http://localhost:8983/solr/files/update/extract?literal.id=' + id + 'commit=true', formData, {
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

    }

    getDataSource(uuid: string): [StoredTextDataSource, { "code": number, "message": string }] {
        this.readFile()
        let index: number = this.textDataSourceArray.findIndex(x => x.uuid === uuid);
        if (index !== -1) {
            return [this.textDataSourceArray[index], null];
        }
        return [null, {
            "code": 404,
            "message": "Datasource not found"
        }]
    }

    getAllDataSources(): [StoredTextDataSource[], { "code": number, "message": string }] {
        this.readFile()
        return [this.textDataSourceArray, null];
    }

    updateDataSource(uuid: string, dataSource: TextDataSource) {
        let index: number = this.textDataSourceArray.findIndex(x => x.uuid === uuid);
        if (index !== -1) {
            this.textDataSourceArray[index].path = dataSource.path;
            this.textDataSourceArray[index].filename = dataSource.filename;
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

    deleteDataSource(uuid: string) {
        this.readFile()
        let index: number = this.textDataSourceArray.findIndex(x => x.uuid === uuid);
        if (index !== -1) {
            this.textDataSourceArray.splice(index, 1);
            fs.writeFileSync('./src/repositories/store/textDataStore.json', JSON.stringify(this.textDataSourceArray));
            return [{
                "code": 204,
                "message": "Successfully deleted Text datasource"
            }, null]
        }
        return [null, {
            "code": 404,
            "message": "Text datasource not found"
        }]
    }

    readFile() {
        try {
            this.textDataSourceArray = JSON.parse(fs.readFileSync('./src/repositories/store/textDataStore.json', 'utf-8'));
        } catch (err) {
            this.textDataSourceArray = [];
        }
    }
}

const textDataSourceRepository = new TextDataSourceRepository();
export default textDataSourceRepository;