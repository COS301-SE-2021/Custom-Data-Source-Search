/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
import fileDataSourceService from "../services/FileDataSource.service";

/**
 * Router Definition
 */
export const fileDataSourceRouter = express.Router();

/**
 * Controller Definitions
 */


/**
 * Return the file names and paths of all File Data Sources
 */
fileDataSourceRouter.get("/", (req: Request, res: Response) => {
    const result = fileDataSourceService.getAllFileDataSources();
    res.status(result.code).send(result.body);
});

/**
 * Return the file names and paths of a single File Data Source
 */
fileDataSourceRouter.get("/:id", (req: Request, res: Response) => {
    const result = fileDataSourceService.getFileDataSource(req.params.id);
    res.status(result.code).send(result.body);
});


/**
 * Add a data source by it's path and file name
 */
fileDataSourceRouter.post("/", async (req: Request, res: Response) => {
    const [, err] = await fileDataSourceService.addFileDataSource(req.body);
    if (err) {
        res.status(err.code).send({'message': err.message});
    } else {
        res.status(200).send({'message':'Successfully added file datasource'});
    }
});

/**
 * Remove a data source by it's id
 */
fileDataSourceRouter.delete("/", async (req: Request, res: Response) => {
    const result = await fileDataSourceService.removeFileDataSource(req.body.id);
    res.status(result.code).send(result.body);
});
