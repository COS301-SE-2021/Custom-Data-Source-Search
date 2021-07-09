/**
 * Data Model Interfaces
 */
import {TextDataSource} from "../models/TextDataSource.interface";
import {
    FileOccurrence, StringOccurrence,
    StringOccurrences,
    StringOccurrencesResponse
} from "../models/response/searchFileResponse.interface";
import fs from 'fs';
import path from 'path';
import FileReadingError from "../errors/FileReadingError";
import textDataSourceRepository from "../repositories/TextDataSourceRepository";
import axios from "axios";


class TextDataSourceService {

    /**
     * In-Memory Store
     */

    textDataSourceArray: TextDataSource[];

    constructor() {
        this.textDataSourceArray = [];
    }

    /**
     * Service Methods
     */
    getAllTextDataSources() {
        let [result, err] = textDataSourceRepository.getAllDataSources();
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

    getTextDataSource(uuid: string) {
        let [result, err] = textDataSourceRepository.getDataSource(uuid);
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

    addTextDataSource(fileName: string, filePath: string) {
        if (fileName === '') {
            throw new FileReadingError('NO FILE NAME', 400);
        } else if (filePath === '') {
            throw new FileReadingError('NO FILE PATH', 400);
        }
        if (filePath[filePath.length - 1] !== '/') {
            filePath += '/';
        }
        try {
            fs.readFileSync(filePath + fileName);
        } catch (err) {
            if (err.code == 'ENOENT') {
                throw new FileReadingError('FILE NOT FOUND', 404);
            } else if (err.code == 'EACCES') {
                throw new FileReadingError('ACCESS FORBIDDEN', 403);
            }
            throw err;
        }
        const temp: TextDataSource = {filename: fileName, path: filePath};
        let [, e] = textDataSourceRepository.addDataSource(temp);
        if (e) {
            throw new FileReadingError('DATASOURCE ALREADY EXISTS', 400);
        }
    }

    removeTextDataSource(uuid: string) {
        let [result, err] = textDataSourceRepository.deleteDataSource(uuid);
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


    async searchAllTextDataSources(searchString: string) : Promise<[StringOccurrencesResponse, Error]> {
        try {
            let response: any  = await axios.get('http://localhost:8983/solr/files/select?q=' + searchString + '&q.op=OR&hl=true&hl.fl=content&hl.highlightMultiTerm=false&hl.snippets=3');
            let result: StringOccurrencesResponse = {};
            let i = 0;
            for (let [key, value] of Object.entries(response["data"]["highlighting"])) {
                // @ts-ignore
                if (value["content"] != undefined) {
                    let stringOccurrences: StringOccurrence[] = [];
                    // @ts-ignore
                    for (let i = 0; i < value["content"].length; i++) {
                        // @ts-ignore
                        // @ts-ignore
                        stringOccurrences.push({"lineNumber": 0, "occurrenceString": value["content"][i]});
                    }
                    result[i++] = {"type": "text", "source": key, "occurrences": stringOccurrences};
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


    searchFile(fileContents: string, searchString: string): StringOccurrences {
        if (searchString === "" || fileContents === "") {
            return {};
        }
        let stringWithStandardLineBreaks = fileContents.replace(/(\r\n|\n|\r)/gm, "\n");
        let matches: StringOccurrences = {};
        let numOccurrence: number = 0;
        for (let index = stringWithStandardLineBreaks.indexOf(searchString); index >= 0; index = stringWithStandardLineBreaks.indexOf(searchString, index + 1)) {
            let lineNum = this.getLineNumber(index, stringWithStandardLineBreaks);
            matches[numOccurrence] = {
                lineNumber: lineNum,
                occurrenceString: '...' + fileContents.substring(index - 12, index + searchString.length + 13) + '...'
            };
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

const textDataSourceService = new TextDataSourceService();
export default textDataSourceService;