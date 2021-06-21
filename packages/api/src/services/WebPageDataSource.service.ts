import {WebPageDataSource, WebPageDataSourceList} from "../models/WebPageDataSource.interface";
import {TextDataSource} from "../models/TextDataSource.interface";
import WebPageUnavailableError from "../errors/WebPageError";
import {StringOccurrences, StringOccurrencesResponse} from "../models/response/searchFileResponse.interface";
import {WebOccurrencesResponse, WebStringOccurrences} from "../models/response/searchWebPageResponse.interface";
import {randomBytes} from "crypto";
import textDataSourceService from "./TextDataSource.service";

const fetch = require("node-fetch");
const axios = require("axios")
const cheerio = require("cheerio")

class WebPageDataSourceService {

    webPageDataSourceArray: WebPageDataSource[];

    constructor(){
        console.log("Web Page Data Source Service started");
        this.webPageDataSourceArray = [];
    }

    getAllWebPageDataSources() : WebPageDataSourceList{

        return this.webPageDataSourceArray;

    }

    getWebPageDataSource(uuid : string) {

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


    async addWebPageDataSource(webUrl: string): Promise<WebPageUnavailableError>{

        const temp: WebPageDataSource = {uuid: randomBytes(16).toString("hex") ,url: webUrl};

        var page;
        var error : WebPageUnavailableError;

        try {
            page = await fetch(webUrl);
        } catch(err) {

            return new WebPageUnavailableError("Web Page not available", 400)


        }

        if(page.status == 200) {
            this.webPageDataSourceArray.push(temp);
            return null;

        } else {
            return new WebPageUnavailableError("Web Page not available", 400)
        }



    }

    async searchAllWebPageDataSources(searchString: string) {
        let result: WebOccurrencesResponse = {};
       let pages: Promise<string>[] = [];

        for (let i = 0; i < this.webPageDataSourceArray.length; i++) {
            //let location = this.webPageDataSourceArray[i].path + this.textDataSourceArray[i].filename;
           let url = this.webPageDataSourceArray[i].url;
            pages.push(this.readWebPage(url));
        }


        let i = 0;
        for await (const content of pages) {
            let searchResults: WebStringOccurrences = this.searchWebPage(await content, searchString);
            if (searchResults.hasOwnProperty('0')) {
                result[i] = {
                    type: "webpage",
                    url: this.webPageDataSourceArray[i].url,
                    occurrences: searchResults
                };
                i++;
            }
        }
        return [result, null];
    }

    async readWebPage(url : string) : Promise<string>{
        var text : string;
        try {
            let page = await fetch(url);
            text = await page.text();
            //   console.log(text);
            return text;
        } catch {
            return "";
        }
    }

    searchWebPage(pageContents : string, searchString : string) : WebStringOccurrences{

        if (searchString === "" || pageContents === "") {
            return {};
        }
        //let stringWithStandardLineBreaks = pageContents.replace(/(\r\n|\n|\r)/gm, "\n");
        let stringWithStandardLineBreaks = pageContents
        let matches: WebStringOccurrences = {};
        let numOccurrence = 0;
        for (let index = stringWithStandardLineBreaks.indexOf(searchString); index >= 0; index = stringWithStandardLineBreaks.indexOf(searchString, index + 1)) {
            //let lineNum = this.getLineNumber(index, stringWithStandardLineBreaks);
            matches[numOccurrence] = {
                occurrenceString: '...' + pageContents.substring(index - 12, index + searchString.length + 13) + '...'
            };
            numOccurrence++;
        }
        return matches;
    }


}

const webPageDataSourceService = new WebPageDataSourceService();
export default webPageDataSourceService;