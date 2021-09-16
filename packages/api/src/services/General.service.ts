import axios from "axios";
import fileDataSourceRepository from "../repositories/FileDataSourceRepository";
import fileDataSourceService from "./FileDataSource.service";
import hljs from "highlight.js";
import folderDataSourceRepository from "../repositories/FolderDataSourceRepository";
import webPageDataSourceRepository from "../repositories/WebPageDataSourceRepository";
import folderDataSourceService from "./FolderDataSource.service";
import webPageDataSourceService from "./WebPageDataSource.service";
import gitHubDataSourceRepository from "../repositories/GitHubDataSourceRepository";
import gitHubDataSourceService from "./GitHubDataSource.service";

class GeneralService {

    async getResults(searchString: string) {
        const [results, error] = await this.searchAllDataSources(searchString);
        if (error) {
            return {
                "code": error.code,
                "body": {
                    "message": error.message
                }
            }
        }
        return {
            "code": 200,
            "body": {
                "message": "success",
                "searchResults": results
            }
        }
    }

    async searchAllDataSources(searchString: string): Promise<[any[], { code: number, message: string }]> {
        try {
            let response: any = await axios.get(
                'http://localhost:' + process.env.SOLR_PORT + '/solr/files/select?q=' +
                encodeURIComponent(searchString) +
                '&q.op=OR&hl=true&hl.fl=content&hl.fragsize=200&hl.highlightMultiTerm=false' +
                '&hl.simple.pre=<6b2f17de-2e79-4d28-899e-a3d02f9cb154open>' +
                '&hl.simple.post=<6b2f17de-2e79-4d28-899e-a3d02f9cb154close>&hl.snippets=10'
            );
            let docs: any[] = response["data"]["response"]["docs"];
            let result: any[] = [];
            for (let [key, value] of Object.entries(response["data"]["highlighting"])) {
                let currentObject = docs.filter(function (doc) {
                    return doc.id == key;
                })[0];
                // @ts-ignore
                if (value["content"] != undefined) {
                    if (currentObject["datasource_type"] === undefined) {
                        result.push({
                            "id": key,
                            "type": currentObject["datasource_type"],
                            "source": "Cannot locate source.",
                            "datasource_name": "Cannot locate name",
                            "datasource_icon": "icon",
                            "match_snippets": [{"snippet": "Error: Document in solr does not contain a type"}]
                        });
                    } else {
                        switch (currentObject["datasource_type"]) {
                            case "file":
                                let fileOccurrences: any[] = [];
                                let [fileDataSource, fileErr] = fileDataSourceRepository.getDataSource(key);
                                if (fileErr) {
                                    continue;
                                }
                                // @ts-ignore
                                for (let occurrence of value["content"]) {
                                    fileOccurrences.push({
                                        "line_number": fileDataSourceService
                                            .getSnippetLineNumber(occurrence, currentObject["content"]),
                                        "snippet": fileDataSourceService
                                            .getSearchSnippet(occurrence, fileDataSource.filename)
                                    });
                                }
                                result.push({
                                    "id": key,
                                    "type": currentObject["datasource_type"],
                                    "source": fileDataSource.path + fileDataSource.filename,
                                    "datasource_name": fileDataSource.filename,
                                    "datasource_icon": "<svg height=\"24\" width=\"24\" fill=\"#2ecc71\" viewBox=\"0 " +
                                        "0 24 24\"><path d=\"M0 0h24v24H0V0z\" fill=\"none\"></path><path d=\"M8 16h8" +
                                        "v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2" +
                                        "-2V8l-6-6zm4 18H6V4h7v5h5v11z\"></path></svg>",
                                    "match_snippets": fileOccurrences
                                });
                                break;
                            case "webpage":
                                let webpageOccurrences: any[] = [];
                                let [webpageDataSource, webpageErr] = webPageDataSourceRepository.getDataSource(key);
                                if (webpageErr) {
                                    continue;
                                }
                                // @ts-ignore
                                for (let occurrence of value["content"]) {
                                    webpageOccurrences.push({
                                        "line_number": fileDataSourceService
                                            .getSnippetLineNumber(occurrence, currentObject["content"]),
                                        "snippet": webPageDataSourceService.getSearchSnippet(occurrence)
                                    });
                                }
                                result.push({
                                    "id": key,
                                    "type": currentObject["datasource_type"],
                                    "source": webpageDataSource.url,
                                    "datasource_name": webpageDataSource.url,
                                    "datasource_icon": "<svg height=\"24\" width=\"24\" fill=\"#3498db\" viewBox=\"0 " +
                                        "0 24 24\"><path d=\"M0 0h24v24H0V0z\" fill=\"none\"></path><path d=\"M11.99 " +
                                        "2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2" +
                                        "zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 " +
                                        "4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14" +
                                        "C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14" +
                                        " 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm" +
                                        "2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.9" +
                                        "6c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H" +
                                        "9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.3" +
                                        "4-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 " +
                                        "3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2" +
                                        "s-.1 1.36-.26 2h-3.38z\"></path></svg>",
                                    "match_snippets": webpageOccurrences
                                });
                                break;
                            case "folder":
                                let folderOccurrences: any[] = [];
                                let [folderDataSource, folderErr] = folderDataSourceRepository.getFolderFromFile(key);
                                if (folderErr) {
                                    continue;
                                }
                                // @ts-ignore
                                for (let occurrence of value["content"]) {
                                    folderOccurrences.push({
                                        "line_number": fileDataSourceService
                                            .getSnippetLineNumber(occurrence, currentObject["content"]),
                                        "snippet": folderDataSourceService.getSearchSnippet(occurrence, key)
                                    });
                                }
                                result.push({
                                    "id": key,
                                    "type": currentObject["datasource_type"],
                                    "source": folderDataSource["path"],
                                    "datasource_name": folderDataSource["folder_name"],
                                    "datasource_icon": "<svg height=\"24\" width=\"24\" fill=\"#f1c40f\" viewBox=\"0 " +
                                        "0 24 24\"><path d=\"M0 0h24v24H0V0z\" fill=\"none\"></path><path d=\"M9.17 6" +
                                        "l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 " +
                                        "2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z\"></path></svg>",
                                    "match_snippets": folderOccurrences
                                });
                                break;
                            case "github":
                                let gitHubOccurrences: any[] = [];
                                let [gitHubDataSource, gitHubErr] = gitHubDataSourceRepository.getRepoFromFile(key);
                                if (gitHubErr) {
                                    continue;
                                }
                                // @ts-ignore
                                for (let occurrence of value["content"]) {
                                    gitHubOccurrences.push({
                                        "line_number": fileDataSourceService
                                            .getSnippetLineNumber(occurrence, currentObject["content"]),
                                        "snippet": gitHubDataSourceService.getSearchSnippet(occurrence, key)
                                    });
                                }
                                result.push({
                                    "id": key,
                                    "type": currentObject["datasource_type"],
                                    "source": "https://github.com/" + gitHubDataSource["repo"],
                                    "datasource_name": gitHubDataSource["repo"].split("/").pop(),
                                    "datasource_icon": '<svg fill="#ffffff" viewBox="0 0 24 24" width="28px" height="' +
                                        '28px"><path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C' +
                                        '8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0' +
                                        '.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3' +
                                        ',1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5' +
                                        '-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6 c0,0,1.' +
                                        '4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,1' +
                                        '7,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4 c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c' +
                                        '0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3 C22,6.' +
                                        '1,16.9,1.4,10.9,2.1z"></path></svg>',
                                    "match_snippets": gitHubOccurrences
                                });
                                break;
                            default:
                                // code block
                                console.log("invalid datasource type");
                        }
                    }
                }
            }
            return [result, null];
        } catch (e) {
            console.error(e)
            return [null, {
                "code": 500,
                "message": "Error when trying to search through solr"
            }]
        }
    }

    async getFullFile(type: string, id: string) {
        try {
            let response: any = await axios.get(
                'http://localhost:' + process.env.SOLR_PORT + '/solr/files/select?q=id%3A'
                + id
                + '&q.op=OR'
            );
            let result: string;
            let content: string = response["data"]["response"]["docs"][0]["content"];
            let dataSource;
            let err;
            let extension: string = "";
            switch (type) {
                case "file":
                    [dataSource, err] = fileDataSourceRepository.getDataSource(id);
                    extension = dataSource.filename.split(".").pop();
                    break;
                case "github":
                    [dataSource, err] = gitHubDataSourceRepository.getFileFromRepo(id);
                    extension = dataSource["file_path"].split(".").pop();
                    break;
                case "folder":
                    [dataSource, err] = folderDataSourceRepository.getFileInFolder(id);
                    extension = dataSource["file_path"].split(".").pop();
                    break;
                default:
                    err = true;
            }
            if (err) {
                result = '<div>' + GeneralService.newLinesToBreaks(content.toString()) + '</div>';
            } else {
                if (["java", "cpp", "js", "ts", "vue", "html", "css", "yml", "json", "xml", "py", "php"]
                    .indexOf(extension) != -1) {
                    let snippet: string;
                    try {
                        snippet = hljs.highlight(content, {language: extension}).value;
                    } catch (e) {
                        snippet = hljs.highlightAuto(content).value;
                    }
                    result = '<pre style="font-family: Arial,sans-serif">' +
                        GeneralService.newLinesToBreaks(snippet) +
                        '</pre>';
                } else {
                    result = '<div>' + GeneralService.newLinesToBreaks(content.toString()) + '</div>';
                }
            }
            return {
                "code": 200,
                "body": {
                    "message": "Success",
                    "data": result
                }
            }
        } catch (e) {
            return {
                "code": 500,
                "body": {
                    "message": "Could not get file from solr"
                }
            }
        }
    }

    private static newLinesToBreaks(content: string) {
        let result: string = "";
        let index: number = content.indexOf('\n');
        let count: number = 1;
        while (index !== -1) {
            result += content.substr(0, index) + '<br id="line_number_' + count++ + '">';
            content = content.substr(index + 1, content.length);
            index = content.indexOf('\n');
        }
        result += content;
        return result;
    }

    async getAllDataSources() {
        let array: any[] = [];
        let [fileResult, fileErr] = fileDataSourceRepository.getAllDataSources();
        if (!fileErr) {
            for (let fileDataSource of fileResult) {
                array.push({
                    "id": fileDataSource.uuid,
                    "location": fileDataSource.path + fileDataSource.filename,
                    "type": "file",
                    "tag1": fileDataSource.tag1,
                    "tag2": fileDataSource.tag2
                });
            }
        }
        let [folderResult, folderErr] = folderDataSourceRepository.getAllDataSources();
        if (!folderErr) {
            for (let folderDataSource of folderResult) {
                array.push({
                    "id": folderDataSource.uuid,
                    "location": folderDataSource.path,
                    "type": "folder",
                    "tag1": folderDataSource.tag1,
                    "tag2": folderDataSource.tag2
                });
            }
        }
        let [webPageResult, webPageError] = webPageDataSourceRepository.getAllDataSources();
        if (!webPageError) {
            for (let webPageDataSource of webPageResult) {
                array.push({
                    "id": webPageDataSource.uuid,
                    "location": webPageDataSource.url,
                    "type": "github",
                    "tag1": webPageDataSource.tag1,
                    "tag2": webPageDataSource.tag2
                });
            }
        }
        let [gitHubResult, gitHubError] = gitHubDataSourceRepository.getAllDataSources();
        if (!gitHubError) {
            for (let gitHubDataSource of gitHubResult) {
                array.push({
                    "id": gitHubDataSource.uuid,
                    "location": gitHubDataSource.repo,
                    "type": "webpage",
                    "tag1": gitHubDataSource.tag1,
                    "tag2": gitHubDataSource.tag2
                });
            }
        }
        return {
            "code": 200,
            "body": {
                "message": "Success",
                "data": array
            }
        }
    }

    async deleteDatasource(type: string, id: string) {
        switch (type.toLocaleLowerCase()) {
            case "file":
                return await fileDataSourceService.removeFileDataSource(id);
            case "folder":
                return await folderDataSourceService.removeFolderDataSource(id);
            case "webpage":
                return webPageDataSourceService.removeWebPageDataSource(id);
            default:
                return {
                    "code": 400,
                    "body": {
                        "message": "Incorrect type specified for delete"
                    }
                }
        }
    }
}

const generalService = new GeneralService();
export default generalService;