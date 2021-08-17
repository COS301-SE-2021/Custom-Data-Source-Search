/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";
import userService from "../services/User.service";
import {check} from "express-validator";

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

userRouter.post("/", [check('users').isArray().custom((users: any) => {
    for (let user of users) {
        if (
            user.hasOwnProperty("name") &&
            user.hasOwnProperty("surname") &&
            user.hasOwnProperty("email") &&
            user.hasOwnProperty("permission")
        ) {
            if (
                user["name"].isString() &&
                user["surname"].isString() &&
                user["email"].isString() &&
                user["permission"].isString()
            ) {
                return true;
            }
        }
    }
})], (req: Request, res: Response) => {
    const result = userService.addUser(req.body.users);
    res.status(result.code).send(result.body);
});

userRouter.delete("/", (req: Request, res: Response) => {
    const result = userService.removeUser(req.body.users);
    res.status(result.code).send(result.body);
});

userRouter.post("/role", (req: Request, res: Response) => {
    const result = userService.setRole(req.body);
    res.status(result.code).send(result.body);
});

userRouter.post("/logout", (req: Request, res: Response) => {
    const result = userService.logoutUser(req.body.users);
    res.status(result.code).send(result.body);
});

userRouter.post("/revoke", (req: Request, res: Response) => {
    const result = userService.revokeUser(req.body.users);
    res.status(result.code).send(result.body);
});

userRouter.post("/global/logout", (req: Request, res: Response) => {
    const result = userService.logoutAllUsers();
    res.status(result.code).send(result.body);
});

userRouter.post("/global/revoke", (req: Request, res: Response) => {
    const result = userService.revokeAllUsers();
    res.status(result.code).send(result.body);
});