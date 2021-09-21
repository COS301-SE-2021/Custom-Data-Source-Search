import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {isLocalBackend} from "../general/generalFunctions";

/**
 * Middleware that authenticates user based on their JWT token
 *
 * @param {string} role Role to compare user role against
 */
export function authUser(role: string) {
    return (req: Request, res: Response, next: Function) => {
        if (isLocalBackend()) {
            return next();
        }
        const auth: string = req.headers.authorization;
        if (auth === undefined) {
            res.status(403);
            return res.send("No JWT present");
        }
        const token: string = auth.split(" ")[1];
        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY);
            if (permissionSufficient(decoded["role"], role)) {
                return next();
            }
            res.status(401);
            return res.send("Insufficient permissions to carry out action");
        } catch (e) {
            res.status(403);
            return res.send("JWT is not signed correctly");
        }
    }
}

/**
 * Test whether permission for user role is greater than that of required role
 *
 * @param {string} actualRole Actual user role
 * @param {string} requiredRole Role to compare against
 * @return {boolean}
 */
function permissionSufficient(actualRole: string, requiredRole: string): boolean {
    return (roleToInt(actualRole) >= roleToInt(requiredRole));
}

/**
 * Converts a role to an integer to make comparisons easier
 *
 * @param {string} role Role to convert to integer
 * @return {int}
 */
function roleToInt(role: string): number {
    switch (role) {
        case "viewer":
            return 0;
        case "editor":
            return 1;
        case "admin":
            return 2;
        case "super":
            return 3;
        default:
            return -1;
    }
}