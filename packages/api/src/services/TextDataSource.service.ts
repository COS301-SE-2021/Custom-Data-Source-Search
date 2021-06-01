/**
 * Data Model Interfaces
 */
import { TextDataSource } from "../models/TextDataSource.interface";
import { TextDataSourceList } from "../models/TextDataSource.interface";


/**
 * In-Memory Store
 */
let textDataSourceList: TextDataSourceList = {
    1: {
        filename: "example.txt",
        path: "Drive/Docs"
    },
    2: {
        filename: "example22.txt",
        path: "Drive/Docs/text"
    }
};



/**
 * Service Methods
 */

export const getAllTextDataSources = async (): Promise<TextDataSourceList> => textDataSourceList;

