/**
 * Data Model Interfaces
 */
import { TextDataSource } from "../models/TextDataSource.interface";
import { TextDataSourceList } from "../models/TextDataSource.interface";
import { StringOccurrenceResponse } from "../models/response/searchFileResponse.interface";


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
        return this.textDataSourceArray[index];
    }

    addTextDataSource(fileName: string, filePath: string){

        let temp: TextDataSource = {filename: fileName, path: filePath}

        this.textDataSourceArray.push(temp);
    }



    /**
     * Internal Methods
     */


    searchFile(fileContents: string, searchString: string): StringOccurrenceResponse {
        if(searchString === ""){
            return {};
        }

        return {
            0:{
                lineNumber : 12,
                occurrenceString : "some return"
            }
        };
    }

}

const textDataSourceService = new TextDataSourceService();
export default textDataSourceService;