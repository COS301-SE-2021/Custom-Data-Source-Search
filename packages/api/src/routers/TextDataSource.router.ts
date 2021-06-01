/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response, text} from "express";
import * as TextDataSourceService from "../services/TextDataSource.service";
import { TextDataSource, TextDataSourceList} from "../models/TextDataSource.interface";

/**
 * Router Definition
 */
export const textDataSourceRouter = express.Router();

/**
 * Controller Definitions
 */
textDataSourceRouter.get("/", async (req: Request, res: Response) => {
    try {
        const textDataSources: TextDataSourceList = await TextDataSourceService.getAllTextDataSources();

        res.status(200).send(textDataSources)
    } catch (e) {
        res.status(500).send(e.message);
    }

});
