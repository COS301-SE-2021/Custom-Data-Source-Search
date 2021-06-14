/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
import textDataSourceService from "../services/TextDataSource.service";
import { TextDataSource, TextDataSourceList} from "../models/TextDataSource.interface";
import {StringOccurrencesResponse} from "../models/response/searchFileResponse.interface";

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

    const result = await generalService.getResults(req.params.searchstring);

    res.status(result.code).send(result.message);

});
