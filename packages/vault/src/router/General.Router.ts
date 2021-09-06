/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
import generalService from "../services/General.Service";
import registrationService from "../services/Registration.Service";
import authenticationService from "../services/Authentication.Service";

/**
 * Router Definition
 */
export const generalRouter = express.Router();

/**
 * Return all the search results from available data sources
 */
generalRouter.get("/",async (req: Request, res: Response) => {
    res.status(400).send({result : "Success"});
});

generalRouter.get("/test/:id",async (req: Request, res: Response) => {
     const result =  generalService.test(req.params.id);
     res.status(result.code).send(result.body);
});

generalRouter.post("/register",async (req: Request, res: Response) => {
    const result = await registrationService.register(req.body)
    res.status(result.code).send(result.message);
});

generalRouter.post("/challenge",async (req: Request, res: Response) => {
    const result = await authenticationService.challenge(req.body)
    res.status(result.code).send(result.message);
});


generalRouter.post("/authenticate",async (req: Request, res: Response) => {
    const result = await authenticationService.authenticate(req.body)
    res.status(result.code).send(result.message);
});
