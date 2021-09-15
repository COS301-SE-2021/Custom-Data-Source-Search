import express, {Request, Response} from "express";
import fileDataSourceService from "../services/FileDataSource.service";

export const fileDataSourceRouter = express.Router();

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
    const result = await fileDataSourceService.addFileDataSource(req.body);
    res.status(result.code).send(result.body);
});

/**
 * Remove a data source by it's id
 */
fileDataSourceRouter.delete("/", async (req: Request, res: Response) => {
    const result = await fileDataSourceService.removeFileDataSource(req.body.id);
    res.status(result.code).send(result.body);
});
