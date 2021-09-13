/**
 * Data Model Interfaces
 */
import {FileDataSource} from "../models/FileDataSource.interface";
import {FileOccurrence, StringOccurrence} from "../models/response/searchFileResponse.interface";
import fs from 'fs';
import path from 'path';
import fileDataSourceRepository from "../repositories/FileDataSourceRepository";
import axios from "axios";
import hljs from "highlight.js";


class FileDataSourceService {

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

    async addFileDataSource(dataSource: FileDataSource) {
        dataSource.path = this.correctPath(dataSource.path);
        if (dataSource.filename === '') {
            return [null, {
                "code": 400,
                "message": "No file name"
            }]
        } else if (dataSource.path === '') {
            return [null, {
                "code": 400,
                "message": "No file path"
            }]
        }
        if (dataSource.path[dataSource.path.length - 1] !== '/') {
            dataSource.path += '/';
        }
        try {
            fs.readFileSync(dataSource.path + dataSource.filename);
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
        let [, e] = await fileDataSourceRepository.addDataSource(dataSource);
        if (e) {
            return [null, e]
        }
        return [{
            "code": 200,
            "message": "Success"
        }, null];
    }

    correctPath(filePath: string) {
        if (filePath === undefined) {
            return filePath;
        }
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


    async searchAllFileDataSources(searchString: string): Promise<[FileOccurrence[], Error]> {
        try {
            let response: any = await axios.get(
                'http://localhost:' + process.env.SOLR_PORT + '/solr/files/select?q=' + searchString
                + '&q.op=OR&hl=true&hl.fl=content&hl.fragsize=200&hl.highlightMultiTerm=false' +
                '&hl.simple.pre=<em style="color: %2388ffff">&hl.snippets=3'
            );
            let result: FileOccurrence[] = [];
            for (let [key, value] of Object.entries(response["data"]["highlighting"])) {
                // @ts-ignore
                if (value["content"] != undefined) {
                    let stringOccurrences: StringOccurrence[] = [];
                    // @ts-ignore
                    for (let i = 0; i < value["content"].length; i++) {
                        // @ts-ignore
                        stringOccurrences.push({"lineNumber": 0, "snippet": value["content"][i]});
                    }
                    let [datasource, err] = fileDataSourceRepository.getDataSource(key);
                    if (err) {
                        result.push({"type": "file", "source": key, "match_snippets": stringOccurrences});
                    } else {
                        result.push({
                            "type": "file",
                            "source": datasource.path + datasource.filename,
                            "match_snippets": stringOccurrences
                        });
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
        for (
            let index = stringWithStandardLineBreaks.indexOf(searchString);
            index >= 0;
            index = stringWithStandardLineBreaks.indexOf(searchString, index + 1)
        ) {
            let lineNum = this.getLineNumber(index, stringWithStandardLineBreaks);
            matches.push({
                lineNumber: lineNum,
                snippet: '...' + fileContents.substring(index - 12, index + searchString.length + 13) + '...'
            });
            numOccurrence++;
        }
        return matches;
    }

    getLineNumber(index: number, fullString: string): number {
        let lineNum = 1;
        for (
            let index2 = fullString.indexOf('\n');
            (index2 < index && index2 >= 0);
            index2 = fullString.indexOf("\n", index2 + 1)
        ) {
            lineNum++;
        }
        return lineNum;
    }

    getSnippetLineNumber(snippet: string, content: string) {
        snippet = snippet.replace(/<6b2f17de-2e79-4d28-899e-a3d02f9cb154open>/g, '');
        snippet = snippet.replace(/<6b2f17de-2e79-4d28-899e-a3d02f9cb154close>/g, '');
        let snippetIndex: number = content.indexOf(snippet);
        return this.getLineNumber(snippetIndex, content);
    }

    getSearchSnippet(snippet: string, fileName: string) {
        let temp: string[] = fileName.split('.');
        let extension: string = temp[temp.length - 1];
        if (["java", "cpp", "js", "ts", "vue", "html", "css", "yml", "json", "xml", "py", "php"].indexOf(extension) != -1) {
            //let searchTerm: string = snippet.substring(snippet.indexOf("<6b2f17de-2e79-4d28-899e-a3d02f9cb154open>") + 42, snippet.indexOf("<6b2f17de-2e79-4d28-899e-a3d02f9cb154close>"));
            if (snippet.indexOf("<6b2f17de-2e79-4d28-899e-a3d02f9cb154open>") > snippet.indexOf("\n")) {
                snippet = snippet.substring(snippet.indexOf("\n"), snippet.length);
            }
            snippet = snippet.replace(/<6b2f17de-2e79-4d28-899e-a3d02f9cb154open>/g, '');
            snippet = snippet.replace(/<6b2f17de-2e79-4d28-899e-a3d02f9cb154close>/g, '');
            while (snippet.indexOf('\n') == 0) {
                snippet = snippet.substr(1, snippet.length);
            }
            try {
                snippet = hljs.highlight(snippet, {language: extension}).value;
            } catch (e) {
                snippet = hljs.highlightAuto(snippet).value;
            }
            /*let reg: RegExp = new RegExp(this.escapeRegExp(searchTerm), 'g');
            snippet = snippet.replace(reg, '<span style=\u0027background-color: #0073ff;color: white;\u0027>' + searchTerm + '</span>');*/
            snippet = '<pre style="margin-top: 0;margin-bottom: 0; white-space: pre-wrap; word-wrap: break-word;">' + snippet + '</pre>';
        } else {
            snippet = '<div>' + this.escapeAndHighlight(snippet) + '</div>';
        }
        return snippet;
    }

    escapeRegExp(string: string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    escapeAndHighlight(snippet: string) {
        let result: string = "";
        let openIndex: number = snippet.indexOf("<6b2f17de-2e79-4d28-899e-a3d02f9cb154open>");
        let closeIndex: number = snippet.indexOf("<6b2f17de-2e79-4d28-899e-a3d02f9cb154close>");
        while (openIndex != -1) {
            result += this.escapeHtml(snippet.substring(0, openIndex));
            result += '<span style=\u0027background-color: #0067e6;color: white;\u0027>';
            result += this.escapeHtml(snippet.substring(openIndex + 42, closeIndex));
            result += '</span>';
            snippet = snippet.substring(closeIndex + 43, snippet.length);
            openIndex = snippet.indexOf("<6b2f17de-2e79-4d28-899e-a3d02f9cb154open>");
            closeIndex = snippet.indexOf("<6b2f17de-2e79-4d28-899e-a3d02f9cb154close>");
        }
        result += snippet;
        result = '<div>' + result + '</div>';
        return result;
    }

    escapeHtml(string: string) {
        return string.replace(new RegExp(/[<>&"']/g), (match) => {
            switch (match) {
                case "<":
                    return "&lt";
                case ">":
                    return "&gt";
                case "&":
                    return "&amp;";
                case '"':
                    return "&quot";
                default:
                    return '&#039;';
            }
        })
    }
}

const fileDataSourceService = new FileDataSourceService();
export default fileDataSourceService;