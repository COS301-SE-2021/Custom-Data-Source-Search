/**
 * Data Model Interfaces
 */
import {TextDataSource} from "../models/TextDataSource.interface";
import {StringOccurrences, StringOccurrencesResponse} from "../models/response/searchFileResponse.interface";
import fs from 'fs';
import path from 'path';
import FileReadingError from "../errors/FileReadingError";
import textDataSourceRepository from "../repositories/TextDataSourceRepository";


class TextDataSourceService {

    /**
     * In-Memory Store
     */

    textDataSourceArray: TextDataSource[];

    constructor() {
        console.log("Text Data Source Service started");
        this.textDataSourceArray = [];
    }


    setDataSourceArray() {
        textDataSourceRepository.addDataSource({filename: 'hello.txt', path: '../test/'});
        textDataSourceRepository.addDataSource({filename: 'beans.txt', path: '../test/'});
    }

    /**
     * Service Methods
     */
    getAllTextDataSources() {
        let [result, err] = textDataSourceRepository.getAllDataSources();
        if (!err && result) {
            return {
                "code": 200,
                "body": result[0]
            };
        }
        return {
            "code": 500,
            "body": {
                "message": "Internal error"
            }
        }
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
        const temp: TextDataSource = {filename: fileName, path: filePath}
        textDataSourceRepository.addDataSource(temp);
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
            "code": 200,
            "body": {
                "message": result.message
            }
        }
    }

    async searchAllTextDataSources(searchString: string) {
        // TODO make this right
        let [data] = textDataSourceRepository.getAllDataSources();
        // Upto here is placeholder
        let result: StringOccurrencesResponse = {};
        let file: Promise<string>[] = [];
        for (let i = 0; i < data.length; i++) {
            let location = data[i].path + data[i].filename;
            file.push(this.readFile(location));
        }
        let i = 0;
        for await (const content of file) {
            result[i] = {
                fileName: data[i].filename,
                occurrences: this.searchFile(content, searchString)
            };
            i++;
        }
        return [result, null];
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