import {WebPageDataSource} from "../models/WebPageDataSource.interface";
import {WebStringOccurrence} from "../models/response/searchWebPageResponse.interface";
import webPageDataSourceRepository from "../repositories/WebPageDataSourceRepository";
import fetch from 'node-fetch';

class WebPageDataSourceService {

    // getAllWebPageDataSources() {
    //     let [result, err] = webPageDataSourceRepository.getAllDataSources();
    //     if (err) {
    //         return {
    //             "code": 500,
    //             "body": {
    //                 "message": "Internal error"
    //             }
    //         }
    //     }
    //     return {
    //         "code": 200,
    //         "body": result
    //     };
    // }
    //
    // getWebPageDataSource(uuid: string) {
    //     let [result, err] = webPageDataSourceRepository.getDataSource(uuid);
    //     if (err) {
    //         return {
    //             "code": err.code,
    //             "body": {
    //                 "message": err.message
    //             }
    //         }
    //     }
    //     return {
    //         "code": 200,
    //         "body": {
    //             "message": "Success",
    //             "data": result
    //         }
    //     }
    // }
    //
    // removeWebPageDataSource(uuid: string) {
    //     let [result, err] = webPageDataSourceRepository.deleteDataSource(uuid);
    //     if (err) {
    //         return {
    //             "code": err.code,
    //             "body": {
    //                 "message": err.message
    //             }
    //         }
    //     }
    //     return {
    //         "code": 204,
    //         "body": {
    //             "message": result.message
    //         }
    //     }
    // }

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

    async readWebPage(url: string): Promise<string> {
        let text: string;
        try {
            let page = await fetch(url);
            text = await page.text();
            return text;
        } catch {
            return "";
        }
    }

    searchWebPage(pageContents: string, searchString: string): WebStringOccurrence[] {
        if (searchString === "" || pageContents === "") {
            return [];
        }
        //let stringWithStandardLineBreaks = pageContents.replace(/(\r\n|\n|\r)/gm, "\n");
        let stringWithStandardLineBreaks = pageContents
        let matches: WebStringOccurrence[] = [];
        let numOccurrence = 0;
        for (let index = stringWithStandardLineBreaks.indexOf(searchString); index >= 0; index = stringWithStandardLineBreaks.indexOf(searchString, index + 1)) {
            //let lineNum = this.getLineNumber(index, stringWithStandardLineBreaks);
            matches.push({
                snippet: '...' + pageContents.substring(index - 12, index + searchString.length + 13) + '...'
            });
            numOccurrence++;
        }
        return matches;
    }
}

const webPageDataSourceService = new WebPageDataSourceService();
export default webPageDataSourceService;