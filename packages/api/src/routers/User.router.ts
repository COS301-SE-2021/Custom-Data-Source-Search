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

/**
 * Return all users that have been added to the system
 */
userRouter.get("/", (req: Request, res: Response) => {
    const result = userService.getAllUsers();
    res.status(result.code).send(result.body);
});

/**
 * Add new users to the system
 */
userRouter.post("/", [check('users').isArray().custom((users: any) => {
    for (let user of users) {
        if (
            user.hasOwnProperty("first_name") &&
            user.hasOwnProperty("last_name") &&
            user.hasOwnProperty("email") &&
            user.hasOwnProperty("role")
        ) {
            if (
                user["first_name"].isString() &&
                user["last_name"].isString() &&
                user["email"].isString() &&
                user["role"].isString()
            ) {
                return true;
            }
        }
    }
})], (req: Request, res: Response) => {
    const result = userService.addUser(req.body.users);
    res.status(result.code).send(result.body);
});

/**
 * Delete users from the system
 */
userRouter.delete("/", (req: Request, res: Response) => {
    const result = userService.removeUser(req.body.users);
    res.status(result.code).send(result.body);
});

/**
 * Set the role for users in the system
 */
userRouter.post("/role", (req: Request, res: Response) => {
    const result = userService.setRole(req.body);
    res.status(result.code).send(result.body);
});

/**
 * Logout specified users from using the system
 */
userRouter.post("/logout", (req: Request, res: Response) => {
    const result = userService.logoutUser(req.body.users);
    res.status(result.code).send(result.body);
});

/**
 * Revoke access to the system for specified users
 */
userRouter.post("/revoke", (req: Request, res: Response) => {
    const result = userService.revokeUser(req.body.users);
    res.status(result.code).send(result.body);
});

/**
 * Logout all users from the system
 */
userRouter.post("/global/logout", (req: Request, res: Response) => {
    const result = userService.logoutAllUsers();
    res.status(result.code).send(result.body);
});

/**
 * Revoke access for all users
 */
userRouter.post("/global/revoke", (req: Request, res: Response) => {
    const result = userService.revokeAllUsers();
    res.status(result.code).send(result.body);
});

/**
 * Generate jwt token for users that are logged in
 */
userRouter.post("/generatetoken", (req: Request, res: Response) => {
    const result = userService.generateToken(req.body);
    res.status(result.code).send(result.body);
});

/**
 * Login to the system if you are registered
 */
userRouter.post("/login", (req: Request, res: Response) => {
    const result = userService.login(req.body);
    res.status(result.code).send(result.body);
});

/**
 * Generate registration keys for specified users
 */
userRouter.post("/registrationkey", (req: Request, res: Response) => {
    const result = userService.generateRegistrationKey(req.body.users);
    res.status(result.code).send(result.body);
});

/**
 * Send registration keys via email to specified users
 */
userRouter.post("/email", (req: Request, res: Response) => {
    const result = userService.sendEncodedRegistrationKeyToUser(req.body.users);
    res.status(result.code).send(result.body);
});

/**
 * Register to a backend with a registration key
 */
userRouter.post("/register", (req: Request, res: Response) => {
    const result = userService.register(req.body);
    res.status(result.code).send(result.body);
});