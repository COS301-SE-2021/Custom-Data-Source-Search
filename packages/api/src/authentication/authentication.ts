import {Request, Response} from "express";
import jwt from "jsonwebtoken";

export function authUser(role: string) {
    return (req: Request, res: Response, next: Function) => {
        if (process.env.LOCAL_BACKEND === "true") {
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

function permissionSufficient(actualRole: string, requiredRole: string) {
    return (roleToInt(actualRole) >= roleToInt(requiredRole));
}

function roleToInt(role: string) {
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