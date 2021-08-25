/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
import generalService from "../services/General.Service";

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
generalRouter.get("/",async (req: Request, res: Response) => {
    res.status(400).send({result : "Success"});
});

generalRouter.get("/test/:id",async (req: Request, res: Response) => {
     const result = await generalService.test(req.params.id);
    res.status(result.code).send(result.body);
});
