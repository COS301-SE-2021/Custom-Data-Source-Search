    /**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
import { TextDataSource, TextDataSourceList} from "../models/TextDataSource.interface";
import textDataSourceService from "../services/TextDataSource.service";

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
textDataSourceRouter.get("/", (req: Request, res: Response) => {
    try {
        const textDataSources: TextDataSourceList = textDataSourceService.getAllTextDataSources();

        res.status(200).send(textDataSources)
    } catch (e) {
        res.status(500).send(e.message);
    }

});

/**
 * Return the file names and paths of a single Text Data Source
 */
textDataSourceRouter.get("/:id", (req: Request, res: Response) => {
    try {
        const textDataSource: TextDataSource = textDataSourceService.getTextDataSource(parseInt(req.params.id));

        res.status(200).send(textDataSource)
    } catch (e) {
        res.status(500).send(e.message);
    }
});


/**
 * Add a data source by it's path and file name
 */
textDataSourceRouter.post("/", (req: Request, res: Response) => {
    try {
        textDataSourceService.addTextDataSource(req.body.fileName, req.body.filePath);

        res.status(200).send({'message':'Successfully added text datasource'});
    } catch (e) {
        if (e.status){
            res.status(e.status).send(e.message);
        } else {
            res.status(500).send(e.message);
        }
    }
});

    /**
     * Remove a data source by it's id
     */
    textDataSourceRouter.delete("/", (req: Request, res: Response) => {
        try {
            textDataSourceService.removeTextDataSource(req.body.id);

            res.status(204).send('Successfully removed text datasource');
        } catch (e) {
            if (e.status){
                res.status(e.status).send(e.message);
            } else {
                res.status(500).send(e.message);
            }
        }
    });
