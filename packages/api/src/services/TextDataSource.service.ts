/**
 * Data Model Interfaces
 */
import { TextDataSource } from "../models/TextDataSource.interface";
import { TextDataSourceList } from "../models/TextDataSource.interface";
import { StringOccurrenceResponse } from "../models/response/searchFileResponse.interface";
import fs from 'fs';
import FileReadingError from "../errors/FileReadingError";


class TextDataSourceService {


    /**
     * In-Memory Store
     */

    textDataSourceArray: TextDataSource[];
   // textDataSourceList: TextDataSourceList;

        //= {
      //  1: {
       //     filename: "example.txt",
       //     path: "Drive/Docs"
      //  },
      //  2: {
      //      filename: "example22.txt",
      //      path: "Drive/Docs/text"
     //   }
   // };

    constructor () {
        console.log("Text Data Source Service started");
        this.textDataSourceArray = [];
    }

    /**
     * Service Methods
     */
    getAllTextDataSources() : TextDataSourceList {
       return this.textDataSourceArray;
    }

    getTextDataSource(index : number){
        if(index >= this.textDataSourceArray.length){
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



    /**
     * Internal Methods
     */


    searchFile(fileContents: string, searchString: string): StringOccurrenceResponse {
        if(searchString === "" || fileContents === ""){
            return {};
        }
        var stringWithStandardLineBreaks = fileContents.replace(/(\r\n|\n|\r)/gm, "\n");
        let matches : StringOccurrenceResponse = {};
        let numOccurrence : number = 0;
        for (let index = stringWithStandardLineBreaks.indexOf(searchString);index >= 0; index = stringWithStandardLineBreaks.indexOf(searchString, index + 1)) {
            let lineNum : number = 1;
            for(let index2 = stringWithStandardLineBreaks.indexOf('\n'); (index2 < index && index2 >= 0); index2 = stringWithStandardLineBreaks.indexOf("\n", index2 + 1)){
                lineNum++;
            }
            matches[numOccurrence] = {
                lineNumber : lineNum,
                occurrenceString : fileContents.substring(index -5, index + searchString.length + 10)
            };
            numOccurrence++;
        }

        return matches;
    }

}

const textDataSourceService = new TextDataSourceService();
export default textDataSourceService;