/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
import generalService from "../services/General.service";
import {authUser} from "../authentication/authentication";

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
generalRouter.get("/", authUser("viewer"), async (req: Request, res: Response) => {
    const q: string = req.query.q.toString();
    const result = await generalService.getResults(q);
    res.status(result.code).send(result.body);
});

generalRouter.get("/fullfile", authUser("viewer"), async (req: Request, res: Response) => {
    const type: string = req.query.type.toString();
    const id: string = req.query.id.toString();
    const result = await generalService.getFullFile(type, id);
    res.status(result.code).send(result.body);
});

generalRouter.get("/datasources", authUser("viewer"), async (req: Request, res: Response) => {
    const result = await generalService.getAllDataSources();
    res.status(result.code).send(result.body);
});

generalRouter.delete("/datasources", authUser("editor"), async (req: Request, res: Response) => {
    const result = await generalService.deleteDatasource(req.body.type, req.body.id);
    res.status(result.code).send(result.body);
});