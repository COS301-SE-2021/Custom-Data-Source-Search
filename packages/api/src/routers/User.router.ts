import express, {Request, Response} from "express";
import userService from "../services/User.service";
import {check} from "express-validator";
import {authUser} from "../authentication/authentication";
import {checkRoleFor} from "../general/generalFunctions";

export const userRouter = express.Router();

/**
 * Return all users that have been added to the system
 */
userRouter.get("/", authUser("admin"), (req: Request, res: Response) => {
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
})], authUser("admin"), checkRoleFor("add"), (req: Request, res: Response) => {
    const result = userService.addUser(req.body.users);
    res.status(result.code).send(result.body);
});

/**
 * Delete users from the system
 */
userRouter.delete("/", authUser("admin"), checkRoleFor("delete"), (req: Request, res: Response) => {
    const result = userService.removeUser(req.body.users);
    res.status(result.code).send(result.body);
});

/**
 * Set the role for users in the system
 */
userRouter.post("/role", authUser("admin"), checkRoleFor("role"), (req: Request, res: Response) => {
    const result = userService.setRole(req.body);
    res.status(result.code).send(result.body);
});

/**
 * Logout specified users from using the system
 */
userRouter.post("/logout", authUser("admin"), (req: Request, res: Response) => {
    const result = userService.logoutUser(req.body.users);
    res.status(result.code).send(result.body);
});

/**
 * Revoke access to the system for specified users
 */
userRouter.post("/revoke", authUser("super"), (req: Request, res: Response) => {
    const result = userService.revokeUser(req.body.users);
    res.status(result.code).send(result.body);
});

/**
 * Logout all users from the system
 */
userRouter.post("/global/logout", authUser("super"), (req: Request, res: Response) => {
    const result = userService.logoutAllUsers();
    res.status(result.code).send(result.body);
});

/**
 * Revoke access for all users
 */
userRouter.post("/global/revoke", authUser("super"), (req: Request, res: Response) => {
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
userRouter.post("/registrationkey", authUser("admin"), (req: Request, res: Response) => {
    const result = userService.generateRegistrationKey(req.body.users);
    res.status(result.code).send(result.body);
});

/**
 * Send registration keys via email to specified users
 */
userRouter.post("/email", authUser("admin"), (req: Request, res: Response) => {
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