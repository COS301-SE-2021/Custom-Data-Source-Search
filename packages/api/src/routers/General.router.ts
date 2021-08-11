/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
import generalService from "../services/General.service";

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
generalRouter.get("/", async (req: Request, res: Response) => {
    const q: string = req.query.q.toString();
    const result = await generalService.getResults(q);
    res.status(result.code).send(result.body);

});

generalRouter.get("/fullfile", async (req: Request, res: Response) => {
    const type: string = req.query.type.toString();
    const id: string = req.query.id.toString();
    const result = await generalService.getFullFile(type, id);
    res.status(result.code).send(result.body);
});

generalRouter.get("/datasources", async (req: Request, res: Response) => {
    const result = await generalService.getAllDataSources();
    res.status(result.code).send(result.body);
});