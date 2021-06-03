/**
 * Data Model Interfaces
 */
import { TextDataSource } from "../models/TextDataSource.interface";
import { TextDataSourceList } from "../models/TextDataSource.interface";
import { StringOccurrencesResponse, StringOccurrences } from "../models/response/searchFileResponse.interface";
import fs from 'fs';
import path from 'path';

class TextDataSourceService {

    /**
     * In-Memory Store
     */

    textDataSourceArray: TextDataSource[];

    constructor () {
        console.log("Text Data Source Service started");
        this.textDataSourceArray = [];


        //Temporary Mocked filenames
        this.textDataSourceArray[0] = { filename : 'hello.txt', path: '../test/'}
        this.textDataSourceArray[1] = { filename : 'beans.txt', path: '../test/'}
    }

    /**
     * Service Methods
     */

    getAllTextDataSources() : TextDataSourceList {
        return this.textDataSourceArray;
    }

    getTextDataSource(index : number){
        return this.textDataSourceArray[index];
    }

    addTextDataSource(fileName: string, filePath: string){

        let temp: TextDataSource = {filename: fileName, path: filePath}

        this.textDataSourceArray.push(temp);
    }

    searchAllTextDataSources(searchString : string) : StringOccurrencesResponse{

        let result : StringOccurrencesResponse = {};

        for(let i = 0; i < this.textDataSourceArray.length; i++){

            let location = this.textDataSourceArray[i].path + this.textDataSourceArray[i].filename;

            let file = fs.readFileSync(path.resolve(__dirname,location), 'utf-8');


            result[this.textDataSourceArray[i].filename] = this.searchFile(file, searchString);



        }
        return result;

    }



    /**
     * Internal Methods
     */


    searchFile(fileContents: string, searchString: string): StringOccurrences {
        if(searchString === "" || fileContents === ""){
            return {};
        }
        let stringWithStandardLineBreaks = fileContents.replace(/(\r\n|\n|\r)/gm, "\n");
        let matches : StringOccurrences = {};
        let numOccurrence : number = 0;
        for (let index = stringWithStandardLineBreaks.indexOf(searchString);index >= 0; index = stringWithStandardLineBreaks.indexOf(searchString, index + 1)) {

            let lineNum = this.getLineNumber(index, stringWithStandardLineBreaks);
            matches[numOccurrence] = {
                lineNumber : lineNum,
                occurrenceString : '...' + fileContents.substring(index -12, index + searchString.length + 13) + '...'

            };
            numOccurrence++;
        }

        return matches;
    }

    getLineNumber(index : number, fullString: string): number {

        let lineNum = 1;

        for(let index2 = fullString.indexOf('\n'); (index2 < index && index2 >= 0); index2 = fullString.indexOf("\n", index2 + 1)){
            lineNum++;
        }

        return lineNum;

    }

}

//Only 1 Instance Allowed in the System
const textDataSourceService = new TextDataSourceService();
export default textDataSourceService;