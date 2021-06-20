    /**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
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
    const result = textDataSourceService.getAllTextDataSources();
    res.status(result.code).send(result.body);
});

/**
 * Return the file names and paths of a single Text Data Source
 */
textDataSourceRouter.get("/:id", (req: Request, res: Response) => {
    const result = textDataSourceService.getTextDataSource(req.params.id);
    res.status(result.code).send(result.body);
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
            const result = textDataSourceService.removeTextDataSource(req.body.id);
            res.status(result.code).send(result.body);
    });
