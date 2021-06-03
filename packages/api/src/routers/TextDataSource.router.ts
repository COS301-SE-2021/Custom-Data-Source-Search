    /**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
import { TextDataSource, TextDataSourceList} from "../models/TextDataSource.interface";
import textDataSourceService from "../services/TextDataSource.service";
import {StringOccurrenceResponse} from "../models/response/searchFileResponse.interface";

/**
 * Router Definition
 */
export const textDataSourceRouter = express.Router();

/**
 * Controller Definitions
 */


/**
 * Return the file names and paths of all Text Data Sources
 */
textDataSourceRouter.get("/", async (req: Request, res: Response) => {
    try {
        const textDataSources: TextDataSourceList = await textDataSourceService.getAllTextDataSources();

        res.status(200).send(textDataSources)
    } catch (e) {
        res.status(500).send(e.message);
    }

});

/**
 * Return the file names and paths of a single Text Data Source
 */
textDataSourceRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const textDataSource: TextDataSource = await textDataSourceService.getTextDataSource(parseInt(req.params.id));

        res.status(200).send(textDataSource)
    } catch (e) {
        res.status(500).send(e.message);
    }

});

/**
 * Return results of a search run
 */
textDataSourceRouter.get("/search/string/:searchstring", async (req: Request, res: Response) => {
    try {
        const mockFileContent = 'Ice cream (derived from earlier iced cream or cream ice)[1] is a sweetened frozen food\n typically eaten as a snack or dessert. It may be made from dairy\n milk or cream and is flavoured with a sweetener, either sugar or an alternative, and\n a spice, such as cocoa or vanilla, or with fruit such as strawberries or peaches.'
        const textDataSources: StringOccurrenceResponse = textDataSourceService.searchFile(mockFileContent, req.params.searchstring);

        res.status(200).send(textDataSources);
    } catch (e) {
        res.status(500).send(e.message);
    }

});

/**
 * Add a data source by it's path and file name
 */
textDataSourceRouter.post("/", async (req: Request, res: Response) => {
    try {
       // const textDataSources: TextDataSourceList = await textDataSourceService.getAllTextDataSources();

       // res.status(200).send(textDataSources)
    } catch (e) {
        res.status(500).send(e.message);
    }

});
