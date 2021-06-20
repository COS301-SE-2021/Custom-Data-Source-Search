/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
import folderDataSourceService from "../services/FolderDataSource.service";

/**
 * Router Definition
 */
export const folderDataSourceRouter = express.Router();

/**
 * Controller Definitions
 */

/**
 * Return the file names and paths of all folder Data Sources
 */
folderDataSourceRouter.get("/", (req: Request, res: Response) => {
    const result = folderDataSourceService.getAllFolderDataSources();
    res.status(result.code).send(result.body);
});

/**
 * Return the path of a single folder Data Source specified by the id
 */
folderDataSourceRouter.get("/:id", (req: Request, res: Response) => {
    const result = folderDataSourceService.getFolderDataSource(req.params.id);
    res.status(result.code).send(result.body);
});

/**
 * Add a data source by it's path
 */
folderDataSourceRouter.post("/", (req: Request, res: Response) => {
    const result = folderDataSourceService.addFolderDataSource(req.body.path);
    res.status(result.code).send(result.body);
});

/**
 * Remove a data source by it's id
 */
folderDataSourceRouter.delete("/", (req: Request, res: Response) => {
    const result = folderDataSourceService.removeFolderDataSource(req.body.id);
    res.status(result.code).send(result.body);
});