import express, {Request, Response} from "express";
import generalService from "../services/General.service";
import {authUser} from "../authentication/authentication";

export const generalRouter = express.Router();

/**
 * Return all the search results from available data sources
 */
generalRouter.get("/", authUser("viewer"), async (req: Request, res: Response) => {
    const q: string = req.query.q.toString();
    const result = await generalService.getResults(q);
    res.status(result.code).send(result.body);
});

/**
 * Return content of file associated with a certain document
 */
generalRouter.get("/fullfile", authUser("viewer"), async (req: Request, res: Response) => {
    const type: string = req.query.type.toString();
    const id: string = req.query.id.toString();
    const searchTerm: string = req.query.search_term.toString();
    const result = await generalService.getFullFile(type, id, searchTerm);
    res.status(result.code).send(result.body);
});

/**
 * Return all datasources stored in db
 */
generalRouter.get("/datasources", authUser("viewer"), async (req: Request, res: Response) => {
    const result = await generalService.getAllDataSources();
    res.status(result.code).send(result.body);
});

/**
 * Delete a datasource by id and type
 */
generalRouter.delete("/datasources", authUser("editor"), async (req: Request, res: Response) => {
    const result = await generalService.deleteDatasource(req.body.type, req.body.id);
    res.status(result.code).send(result.body);
});