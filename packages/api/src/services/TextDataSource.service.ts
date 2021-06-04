/**
 * Data Model Interfaces
 */
import { TextDataSource } from "../models/TextDataSource.interface";
import { TextDataSourceList } from "../models/TextDataSource.interface";
import { StringOccurrences, StringOccurrencesResponse } from "../models/response/searchFileResponse.interface";
import fs from 'fs';
import path from 'path';
import FileReadingError from "../errors/FileReadingError";


class TextDataSourceService {


    /**
     * In-Memory Store
     */

    textDataSourceArray: TextDataSource[];


    constructor () {
        console.log("Text Data Source Service started");
        this.textDataSourceArray = [];

        //Temporary Mocked filenames
       // this.textDataSourceArray[0] = { filename : 'hello.txt', path: '../test/'}
      //  this.textDataSourceArray[1] = { filename : 'beans.txt', path: '../test/'}
    }


    setDataSourceArray() {

        this.textDataSourceArray[0] = { filename : 'hello.txt', path: '../test/'};
        this.textDataSourceArray[1] = { filename : 'beans.txt', path: '../test/'};

    }

    /**
     * Service Methods
     */
    getAllTextDataSources() : TextDataSourceList {
       return this.textDataSourceArray;
    }

    getTextDataSource(index : number){
        if(index >= this.textDataSourceArray.length || index < 0){
            throw new Error('Index out of bounds');
        }
        return this.textDataSourceArray[index];
    }

    addTextDataSource(fileName: string, filePath: string){
        if (fileName === '') {
            throw new FileReadingError('NO FILE NAME', 400);
        } else if (filePath === '') {
            throw new FileReadingError('NO FILE PATH', 400);
        }
        try {
            fs.readFileSync(filePath + fileName);
        } catch (err){
            if(err.code == 'ENOENT'){
                throw new FileReadingError('FILE NOT FOUND', 404);
            } else if(err.code == 'EACCES'){
                throw new FileReadingError('ACCESS FORBIDDEN', 403);
            }
            throw err;
        }
        const temp: TextDataSource = {filename: fileName, path: filePath}

        this.textDataSourceArray.push(temp);
    }

    removeTextDataSource(id: number){
        if(id >= this.textDataSourceArray.length || id < 0){
            throw new Error('Index out of bounds');
        }
        this.textDataSourceArray.splice(id, 1);
    }

    searchAllTextDataSources(searchString : string) : StringOccurrencesResponse{

        let result : StringOccurrencesResponse = {};

        for(let i = 0; i < this.textDataSourceArray.length; i++){

            let location = this.textDataSourceArray[i].path + this.textDataSourceArray[i].filename;

            let file = fs.readFileSync(path.resolve(__dirname,location), 'utf-8');


            //result[this.textDataSourceArray[i].filename] = this.searchFile(file, searchString);
            result[i] = {
                fileName : this.textDataSourceArray[i].filename,
                occurrences : this.searchFile(file, searchString)
            };


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

const textDataSourceService = new TextDataSourceService();
export default textDataSourceService;