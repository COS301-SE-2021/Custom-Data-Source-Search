/**
 * Data Model Interfaces
 */
import {FileDataSource} from "../models/FileDataSource.interface";
import {FileOccurrence, StringOccurrence} from "../models/response/searchFileResponse.interface";
import fs from 'fs';
import path from 'path';
import fileDataSourceRepository from "../repositories/FileDataSourceRepository";
import axios from "axios";


class FileDataSourceService {

    /**
     * In-Memory Store
     */

    fileDataSourceArray: FileDataSource[];

    constructor() {
        this.fileDataSourceArray = [];
    }

    /**
     * Service Methods
     */
    getAllFileDataSources() {
        let [result, err] = fileDataSourceRepository.getAllDataSources();
        if (err) {
            return {
                "code": 500,
                "body": {
                    "message": "Internal error"
                }
            }
        }
        return {
            "code": 200,
            "body": result
        };
    }

    getFileDataSource(uuid: string) {
        let [result, err] = fileDataSourceRepository.getDataSource(uuid);
        if (err) {
            return {
                "code": err.code,
                "body": {
                    "message": err.message
                }
            }
        }
        return {
            "code": 200,
            "body": {
                "message": "Success",
                "data": result
            }
        }
    }

    async addFileDataSource(fileName: string, filePath: string) {
        filePath = this.correctPath(filePath);
        if (fileName === '') {
            return [null, {
                "code": 400,
                "message": "No file name"
            }]
        } else if (filePath === '') {
            return [null, {
                "code": 400,
                "message": "No file path"
            }]
        }
        if (filePath[filePath.length - 1] !== '/') {
            filePath += '/';
        }
        try {
            fs.readFileSync(filePath + fileName);
        } catch (err) {
            if (err.code == 'ENOENT') {
                return [null, {
                    "code": 404,
                    "message": "File not found"
                }]
            } else if (err.code == 'EACCES') {
                return [null, {
                    "code": 403,
                    "message": "Access forbidden"
                }]
            }
            return [null, {
                "code": 500,
                "message": "Unknown error"
            }];
        }
        const temp: FileDataSource = {filename: fileName, path: filePath};
        let [, e] = await fileDataSourceRepository.addDataSource(temp);
        if (e) {
            return [null, e]
        }
        return [{
            "code": 200,
            "message": "Success"
        }, null];
    }

    correctPath(filePath: string) {
        return filePath.replace(/\\/g, "/");
    }

    async removeFileDataSource(uuid: string) {
        let [result, err] = await fileDataSourceRepository.deleteDataSource(uuid);
        if (err) {
            return {
                "code": err.code,
                "body": {
                    "message": err.message
                }
            }
        }
        return {
            "code": 204,
            "body": {
                "message": result.message
            }
        }
    }


    async searchAllFileDataSources(searchString: string) : Promise<[FileOccurrence[], Error]> {
        try {
            let response: any  = await axios.get(
                'http://localhost:8983/solr/files/select?q=' + searchString
                + '&q.op=OR&hl=true&hl.fl=content&hl.fragsize=200&hl.highlightMultiTerm=false&hl.simple.pre=<em style="color: %2388ffff">&hl.snippets=3'
            );
            let result: FileOccurrence[] = [];
            for (let [key, value] of Object.entries(response["data"]["highlighting"])) {
                // @ts-ignore
                if (value["content"] != undefined) {
                    let stringOccurrences: StringOccurrence[] = [];
                    // @ts-ignore
                    for (let i = 0; i < value["content"].length; i++) {
                        // @ts-ignore
                        stringOccurrences.push({"lineNumber": 0, "occurrenceString": value["content"][i]});
                    }
                    let [datasource, err] = fileDataSourceRepository.getDataSource(key);
                    if (err) {
                        result.push({"type": "file", "source": key, "occurrences": stringOccurrences});
                    } else {
                        result.push({"type": "file", "source": datasource.path + datasource.filename, "occurrences": stringOccurrences});
                    }
                }
            }
            return [result, null];
        } catch (e) {
            console.error(e)
        }
    }

    async readFile(location: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(path.resolve(__dirname, location), 'utf-8', (err, data) => {
                if (err) return reject(err);
                return resolve(data.toString());
            })
        })
    }


    /**
     * Internal Methods
     */


    searchFile(fileContents: string, searchString: string): StringOccurrence[] {
        if (searchString === "" || fileContents === "") {
            return [];
        }
        let stringWithStandardLineBreaks = fileContents.replace(/(\r\n|\n|\r)/gm, "\n");
        let matches: StringOccurrence[] = [];
        let numOccurrence: number = 0;
        for (let index = stringWithStandardLineBreaks.indexOf(searchString); index >= 0; index = stringWithStandardLineBreaks.indexOf(searchString, index + 1)) {
            let lineNum = this.getLineNumber(index, stringWithStandardLineBreaks);
            matches.push({
                lineNumber: lineNum,
                occurrenceString: '...' + fileContents.substring(index - 12, index + searchString.length + 13) + '...'
            });
            numOccurrence++;
        }
        return matches;
    }

    getLineNumber(index: number, fullString: string): number {
        let lineNum = 1;
        for (let index2 = fullString.indexOf('\n'); (index2 < index && index2 >= 0); index2 = fullString.indexOf("\n", index2 + 1)) {
            lineNum++;
        }
        return lineNum;
    }
}

const fileDataSourceService = new FileDataSourceService();
export default fileDataSourceService;