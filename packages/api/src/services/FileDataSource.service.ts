import {FileDataSource, StoredFileDataSource} from "../models/FileDataSource.interface";
import fs from 'fs';
import fileDataSourceRepository from "../repositories/FileDataSourceRepository";
import hljs from "highlight.js";
import solrService from "./Solr.service";
import {
    generateDefaultHttpResponse,
    generateUUID,
    getLastModifiedDateOfFile, highlightSearchTerms, isLocalBackend, removeFileExtension,
    statusMessage
} from "../general/generalFunctions";
import {DefaultHttpResponse, StatusMessage} from "../models/response/general.interfaces";
import {whiteList} from "../general/whiteList";

class FileDataSourceService {

    getAllFileDataSources() {
        let [result, err] = fileDataSourceRepository.getAllDataSources();
        if (err) {
            return generateDefaultHttpResponse(err);
        }
        return {
            "code": 200,
            "body": result
        };
    }

    getFileDataSource(uuid: string) {
        let [result, err] = fileDataSourceRepository.getDataSource(uuid);
        if (err) {
            return generateDefaultHttpResponse(err);
        }
        return {
            "code": 200,
            "body": result
        };
    }

    validateDataSource(dataSource: FileDataSource): [StatusMessage, StatusMessage] {
        if (dataSource.filename === '') {
            return [null, statusMessage(400, "No file name")];
        } else if (dataSource.path === '') {
            return [null, statusMessage(400, "No file path")];
        }
        if (dataSource.path[dataSource.path.length - 1] !== '/') {
            dataSource.path += '/';
        }
        try {
            fs.readFileSync(dataSource.path + dataSource.filename);
        } catch (err) {
            if (err.code == 'ENOENT') {
                return [null, statusMessage(404, "File not found")];
            } else if (err.code == 'EACCES') {
                return [null, statusMessage(403, "Access forbidden")];
            }
            return [null, statusMessage(500, "Internal server error")];
        }
        return [statusMessage(200, "Datasource is valid"), null];
    }

    async addFileDataSource(dataSource: FileDataSource): Promise<DefaultHttpResponse> {
        const UUID = generateUUID();
        let storedDataSource: StoredFileDataSource;
        if (isLocalBackend()) {
            dataSource.path = this.standardizePath(dataSource.path);
            const [, validateErr] = this.validateDataSource(dataSource);
            if (validateErr) {
                return generateDefaultHttpResponse(validateErr);
            }
            const [fileContent, fileErr] = this.readFile(dataSource.path + dataSource.filename);
            if (fileErr) {
                return generateDefaultHttpResponse(fileErr);
            }
            const [, solrErr] = await solrService.postToSolr(
                fileContent, UUID, removeFileExtension(dataSource.filename), "file"
            );
            if (solrErr) {
                return generateDefaultHttpResponse(solrErr);
            }
            storedDataSource = {
                uuid: UUID,
                filename: dataSource.filename,
                path: dataSource.path,
                lastModified: getLastModifiedDateOfFile(dataSource.path + dataSource.filename),
                tag1: dataSource.tag1,
                tag2: dataSource.tag2
            };
        } else {
            const filePath: string = __dirname + "/" + dataSource.filename;
            fs.writeFileSync(filePath, dataSource.file, {encoding: "base64"});
            const [fileContent, fileErr] = this.readFile(filePath);
            if (fileErr) {
                fs.unlinkSync(filePath);
                return generateDefaultHttpResponse(fileErr);
            }
            const [, solrErr] = await solrService.postToSolr(
                fileContent, UUID, removeFileExtension(dataSource.filename), "file"
            );
            if (solrErr) {
                fs.unlinkSync(filePath);
                return generateDefaultHttpResponse(solrErr);
            }
            storedDataSource = {
                uuid: UUID,
                filename: dataSource.filename,
                path: "",
                lastModified: new Date(),
                tag1: dataSource.tag1,
                tag2: dataSource.tag2
            };
            fs.unlinkSync(filePath);
        }
        const [success, repositoryErr] = fileDataSourceRepository.addDataSource(storedDataSource);
        if (repositoryErr) {
            return generateDefaultHttpResponse(repositoryErr);
        }
        return generateDefaultHttpResponse(success);
    }

    readFile(path: string): [Buffer, StatusMessage] {
        try {
            return [fs.readFileSync(path), null];
        } catch (e) {
            return [null, statusMessage(500, "Error reading file")];
        }
    }

    standardizePath(filePath: string): string {
        if (filePath === undefined) {
            return filePath;
        }
        return filePath.replace(/\\/g, "/");
    }

    async removeFileDataSource(uuid: string): Promise<DefaultHttpResponse> {
        const [, solrErr] = await solrService.deleteFromSolr(uuid);
        if (solrErr) {
            return generateDefaultHttpResponse(solrErr);
        }
        let [result, err] = fileDataSourceRepository.deleteDataSource(uuid);
        if (err) {
            return generateDefaultHttpResponse(err);
        }
        return generateDefaultHttpResponse(result);
    }

    /**
     * Reindex documents in solr that have been updated locally
     * @async
     */
    async updateDatasources(): Promise<void> {
        const [fileDataList, repositoryErr]  = fileDataSourceRepository.getAllDataSources();
        if (repositoryErr) {
            return;
        }
        for (let fileData of fileDataList) {
            const filePath: string = fileData.path + fileData.filename;
            const lastModified: number = getLastModifiedDateOfFile(filePath).getTime();
            if (fileData.lastModified.getTime() !== lastModified) {
                try {
                    await solrService.postToSolr(
                        fs.readFileSync(filePath),
                        fileData.uuid,
                        removeFileExtension(fileData.filename),
                        "file"
                    );
                    fileDataSourceRepository.updateLastModified(fileData.uuid, lastModified);
                } catch (e) {
                    console.error("Error posting file to solr");
                }
            }
        }
    }

    /**
     * Count the newlines to determine on what line a specified index is
     * @param index
     * @param content
     */
    getLineNumber(index: number, content: string): number {
        let lineNum = 1;
        for (let i = content.indexOf('\n'); (i < index && i >= 0); i = content.indexOf("\n", i + 1)) {
            lineNum++;
        }
        return lineNum;
    }

    getSnippetLineNumber(snippet: string, content: string, searchTermIdentifier: string): number {
        const openTag: string = '<' + searchTermIdentifier + 'open>';
        const closeTag: string = '<' + searchTermIdentifier + 'close>';
        snippet = snippet.replace(new RegExp(openTag, "g"), '');
        snippet = snippet.replace(new RegExp(closeTag, "g"), '');
        let snippetIndex: number = content.indexOf(snippet);
        return this.getLineNumber(snippetIndex, content);
    }

    getSearchSnippet(snippet: string, fileName: string, searchTermIdentifier: string) {
        const openTag: string = '<' + searchTermIdentifier + 'open>';
        const closeTag: string = '<' + searchTermIdentifier + 'close>';
        let extension: string = fileName.split('.').pop();
        whiteList.hasOwnProperty(extension.toLocaleLowerCase())
        if (whiteList.hasOwnProperty(extension.toLocaleLowerCase())) {
            let searchTerm: string = snippet
                .substring(snippet.indexOf(openTag) + openTag.length, snippet.indexOf(closeTag));
            // let searchTerms: string[] = this.getSearchTerms(snippet, )
            if (snippet.indexOf(openTag) > snippet.indexOf("\n")) {
                snippet = snippet.substring(snippet.indexOf("\n"), snippet.length);
            }
            snippet = snippet.replace(new RegExp(openTag, "g"), '');
            snippet = snippet.replace(new RegExp(closeTag, "g"), '');
            while (snippet.indexOf('\n') == 0) {
                snippet = snippet.substr(1, snippet.length);
            }
            try {
                snippet = hljs.highlight(snippet, {language: extension}).value;
            } catch (e) {
                snippet = hljs.highlightAuto(snippet).value;
            }
            snippet = highlightSearchTerms(snippet, [searchTerm]);
            snippet =
                '<pre style="margin-top: 0;margin-bottom: 0; white-space: pre-wrap; word-wrap: break-word;">' +
                snippet +
                '</pre>';
        } else {
            snippet = '<div>' + this.escapeAndHighlight(snippet, searchTermIdentifier) + '</div>';
        }
        return snippet;
    }

    escapeAndHighlight(snippet: string, searchTermIdentifier: string) {
        const openTag: string = '<' + searchTermIdentifier + 'open>';
        const closeTag: string = '<' + searchTermIdentifier + 'close>';
        let result: string = "";
        let openIndex: number = snippet.indexOf(openTag);
        let closeIndex: number = snippet.indexOf(closeTag);
        while (openIndex != -1) {
            result += this.escapeHtml(snippet.substring(0, openIndex));
            result += '<span style=\u0027background-color: #0067e6;color: white;\u0027>';
            result += this.escapeHtml(snippet.substring(openIndex + 42, closeIndex));
            result += '</span>';
            snippet = snippet.substring(closeIndex + 43, snippet.length);
            openIndex = snippet.indexOf(openTag);
            closeIndex = snippet.indexOf(closeTag);
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