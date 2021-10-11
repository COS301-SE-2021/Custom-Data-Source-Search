import {WebPageDataSource} from "../models/WebPageDataSource.interface";
import webPageDataSourceRepository from "../repositories/WebPageDataSourceRepository";
import fetch from 'node-fetch';
import fileDataSourceService from "./FileDataSource.service";

class WebPageDataSourceService {

    getAllWebPageDataSources() {
        let [result, err] = webPageDataSourceRepository.getAllDataSources();
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

    getWebPageDataSource(uuid: string) {
        let [result, err] = webPageDataSourceRepository.getDataSource(uuid);
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

    async removeWebPageDataSource(uuid: string) {
        let [result, err] = await webPageDataSourceRepository.deleteDataSource(uuid);
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

    async addWebPageDataSource(dataSource: WebPageDataSource) {
        let page;
        try {
            page = await fetch(dataSource.url);
        } catch (err) {
            return [null, {
                "code": 500,
                "message": "Error when trying to access url"
            }];
        }
        if (page.status == 200) {
            let [, e] = await webPageDataSourceRepository.addDataSource(dataSource, await page.text());
            if (e) {
                return [null, e]
            }
            return [{
                "code": 200,
                "message": "Success"
            }, null];
        } else {
            return [null, {
                "code": 400,
                "message": "Web page not available"
            }]
        }
    }

    getSearchSnippet(snippet: string, searchTermIdentifier: string) {
        snippet = '<div>' + fileDataSourceService.escapeAndHighlight(snippet, searchTermIdentifier) + '</div>';
        return snippet;
    }
}

const webPageDataSourceService = new WebPageDataSourceService();
export default webPageDataSourceService;