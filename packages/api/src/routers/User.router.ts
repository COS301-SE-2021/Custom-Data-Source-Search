/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
import userService from "../services/User.service";

/**
 * Router Definition
 */
export const userRouter = express.Router();

/**
 * Controller Definitions
 */

userRouter.get("/", (req: Request, res: Response) => {
    const result = userService.getAllUsers();
    res.status(result.code).send(result.body);
});

userRouter.post("/", (req: Request, res: Response) => {
    const result = userService.addUser(req.body);
    res.status(result.code).send(result.body);
});