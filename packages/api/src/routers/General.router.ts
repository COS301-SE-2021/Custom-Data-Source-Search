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
generalRouter.get("/:searchstring", async (req: Request, res: Response) => {

    const result = await generalService.searchAllDataSources(req.params.searchstring);
    res.status(result.code).send(result.body);

});
