import {FileDataSource, StoredFileDataSource} from "../models/FileDataSource.interface";
import fs from 'fs';
import fileDataSourceRepository from "../repositories/FileDataSourceRepository";
import hljs from "highlight.js";
import solrService from "./solr.service";
import {
    generateDefaultHttpResponse,
    generateUUID,
    getLastModifiedDateOfFile,
    statusMessage
} from "../general/generalFunctions";
import {DefaultHttpResponse, StatusMessage} from "../models/response/general.interfaces";

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
            "body": {
                "message": "Success",
                "data": result
            }
        };
    }

    validateDataSource(dataSource: FileDataSource) {
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
        dataSource.path = this.standardizePath(dataSource.path);
        const [, validateErr] = this.validateDataSource(dataSource);
        if (validateErr) {
            return generateDefaultHttpResponse(validateErr);
        }
        const [fileContent, fileErr] = this.readFile(dataSource.path + dataSource.filename);
        if (fileErr) {
            return generateDefaultHttpResponse(fileErr);
        }
        const UUID = generateUUID();
        const [, solrErr] = await solrService.postToSolr(
            fileContent, UUID, this.removeExtension(dataSource.filename), "file"
        );
        if (solrErr) {
            return generateDefaultHttpResponse(solrErr);
        }
        const storedDataSource: StoredFileDataSource = {
            uuid: UUID,
            filename: dataSource.filename,
            path: dataSource.path,
            lastModified: getLastModifiedDateOfFile(dataSource.path + dataSource.filename),
            tag1: dataSource.tag1,
            tag2: dataSource.tag2
        };
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

    /**
     * Remove extension from file name
     *
     * @param {string} fileName
     * @return {string}
     */
    removeExtension(fileName: string): string {
        let lastIndex: number = fileName.lastIndexOf(".");
        fileName = fileName.substring(0, lastIndex);
        return fileName;
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
        let [result, err] = await fileDataSourceRepository.deleteDataSource(uuid);
        if (err) {
            return generateDefaultHttpResponse(err);
        }
        return generateDefaultHttpResponse(result);
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

    getSnippetLineNumber(snippet: string, content: string): number {
        snippet = snippet.replace(/<6b2f17de-2e79-4d28-899e-a3d02f9cb154open>/g, '');
        snippet = snippet.replace(/<6b2f17de-2e79-4d28-899e-a3d02f9cb154close>/g, '');
        let snippetIndex: number = content.indexOf(snippet);
        return this.getLineNumber(snippetIndex, content);
    }

    getSearchSnippet(snippet: string, fileName: string) {
        let temp: string[] = fileName.split('.');
        let extension: string = temp[temp.length - 1];
        if (["java", "cpp", "js", "ts", "vue", "html", "css", "yml", "json", "xml", "py", "php"]
            .indexOf(extension) != -1) {
            //let searchTerm: string = snippet.substring(snippet.indexOf("<6b2f17de-2e79-4d28-899e-a3d02f9cb154open>")
            // + 42, snippet.indexOf("<6b2f17de-2e79-4d28-899e-a3d02f9cb154close>"));
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
            snippet = snippet.replace(
                reg,
                '<span style=\u0027background-color: #0073ff;color: white;\u0027>' + searchTerm + '</span>'
            );*/
            snippet =
                '<pre style="margin-top: 0;margin-bottom: 0; white-space: pre-wrap; word-wrap: break-word;">' +
                snippet +
                '</pre>';
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
                    return "&lt"
                case ">":
                    return "&gt"
                case "&":
                    return "&amp;"
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