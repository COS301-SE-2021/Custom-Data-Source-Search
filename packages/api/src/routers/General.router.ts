/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
import textDataSourceService from "../services/TextDataSource.service";
import { TextDataSource, TextDataSourceList} from "../models/TextDataSource.interface";

/**
 * Router Definition
 */
export const generalRouter = express.Router();

/**
 * Controller Definitions
 */


/**
 * Return all the search results from available data sources
 */
generalRouter.get("/:searchstring", async (req: Request, res: Response) => {
    try {
        // const textDataSources: TextDataSourceList = await textDataSourceService.getAllTextDataSources();
        //
        // res.status(200).send(textDataSources)
    } catch (e) {
        res.status(500).send(e.message);
    }

});
