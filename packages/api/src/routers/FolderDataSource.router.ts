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
folderDataSourceRouter.post("/", async (req: Request, res: Response) => {
    const result = await folderDataSourceService.addFolderDataSource(req.body);
    res.status(result.code).send(result.body);
});

/**
 * Remove a data source by it's id
 */
folderDataSourceRouter.delete("/", async (req: Request, res: Response) => {
    const result = await folderDataSourceService.removeFolderDataSource(req.body.id);
    res.status(result.code).send(result.body);
});