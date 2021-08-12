import {WebPageDataSource} from "../models/WebPageDataSource.interface";
import WebPageUnavailableError from "../errors/WebPageError";
import {WebPageOccurrence, WebStringOccurrence} from "../models/response/searchWebPageResponse.interface";
import {randomBytes} from "crypto";

const fetch = require("node-fetch");

class WebPageDataSourceService {

    webPageDataSourceArray: WebPageDataSource[];

    constructor() {
        this.webPageDataSourceArray = [];
    }

    getAllWebPageDataSources(): WebPageDataSource[] {
        return this.webPageDataSourceArray;
    }

    getWebPageDataSource(uuid: string) {
        let index: number = this.webPageDataSourceArray.findIndex(x => x.uuid === uuid);
        if (index !== -1) {
            return this.webPageDataSourceArray[index];
        }
    }

    removeWebPageDataSource(uuid: string) {
        let index: number = this.webPageDataSourceArray.findIndex(x => x.uuid === uuid);
        if (index !== -1) {
            this.webPageDataSourceArray.splice(index, 1);
        }
    }

    async addWebPageDataSource(webUrl: string): Promise<WebPageUnavailableError> {
        const temp: WebPageDataSource = {uuid: randomBytes(16).toString("hex"), url: webUrl};
        let page;
        try {
            page = await fetch(webUrl);
        } catch (err) {
            return new WebPageUnavailableError("Web Page not available", 400)
        }
        if (page.status == 200) {
            this.webPageDataSourceArray.push(temp);
            return null;
        } else {
            return new WebPageUnavailableError("Web Page not available", 400)
        }
    }

    async searchAllWebPageDataSources(searchString: string) {
        let result: WebPageOccurrence[] = [];
        let pages: Promise<string>[] = [];
        for (let i = 0; i < this.webPageDataSourceArray.length; i++) {
            let url = this.webPageDataSourceArray[i].url;
            pages.push(this.readWebPage(url));
        }
        let i = 0;
        for await (const content of pages) {
            let searchResults: WebStringOccurrence[] = this.searchWebPage(content, searchString);
            if (searchResults.length > 0) {
                result.push({
                    type: "webpage",
                    url: this.webPageDataSourceArray[i].url,
                    match_snippets: searchResults
                });
                i++;
            }
        }
        return [result, null];
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