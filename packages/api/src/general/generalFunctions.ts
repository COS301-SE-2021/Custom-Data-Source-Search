import {randomBytes} from "crypto";
import fs from "fs";
import {DefaultHttpResponse, StatusMessage} from "../models/response/general.interfaces";
import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {permissionGreater, permissionSufficient} from "../authentication/authentication";
import userRepository from "../repositories/UserRepository";
import {StoredFileDataSource} from "../models/FileDataSource.interface";

export function generateUUID(): string {
    return randomBytes(16).toString("hex");
}

export function getLastModifiedDateOfFile(filePath: string): Date {
    try {
        return fs.statSync(filePath).mtime;
    } catch (e) {
        return new Date(0);
    }
}

export function generateDefaultHttpResponse(response: { code: number; message: string; }): DefaultHttpResponse {
    return {
        "code": response.code,
        "body": {
            "message": response.message
        }
    };
}

export function statusMessage(code: number, message: string): StatusMessage {
    return {
        code: code,
        message: message
    }
}

export function removeFileExtension(fileName: string): string {
    let lastIndex: number = fileName.lastIndexOf(".");
    if (lastIndex === -1) {
        return fileName
    }
    return fileName.substring(0, lastIndex);
}

export function isLocalBackend(): boolean {
    return process.env.LOCAL_BACKEND == "true";
}

export function checkRoleFor(type: string) {
    return (req: Request, res: Response, next: Function) => {
        const auth: string = req.headers.authorization;
        const token: string = auth.split(" ")[1];
        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const requestUserRole: string = decoded["role"];
            if (type === "add") {
                for (let user of req.body.users) {
                    if (permissionGreater(user["role"], requestUserRole)) {
                        res.status(403);
                        return res.send({"message": "Insufficient permissions to carry out action"});
                    }
                }
            } else if (type === "role"){
                if (permissionGreater(req.body.role, requestUserRole)) {
                    res.status(403);
                    return res.send({"message": "Insufficient permissions to carry out action"});
                }
                for (let user of userRepository.getUsers(req.body.users)) {
                    if (permissionSufficient(user.role, requestUserRole)) {
                        res.status(403);
                        return res.send({"message": "Insufficient permissions to carry out action"});
                    }
                }
            } else if (type === "delete") {
                for (let user of userRepository.getUsers(req.body.users)) {
                    if (user.role === "super" || !permissionSufficient(requestUserRole, user.role)) {
                        res.status(403);
                        return res.send({"message": "Insufficient permissions to carry out action"});
                    }
                }
            }
            return next();
        } catch (e) {
            res.status(401);
            return res.send({"message": "JWT is not signed correctly"});
        }
    }
}

export function castToStoredFileOverNetwork(datasource: StoredFileDataSource) {
    return {
        uuid: datasource.uuid,
        filename: datasource.filename,
        path: datasource.path,
        lastModified: datasource.lastModified.toJSON(),
        tag1: datasource.tag1,
        tag2: datasource.tag2
    }
}

export function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function highlightSearchTerms(content: string, searchTerms: string[]): string {
    if (content === undefined) {
        return "";
    }
    // Parts Of Regex
    const validWord = "[\\w\\s\\-_/:;,#.]+"; // WARNING: NO closing tags allowed in here! {', ", >} are ILLEGAL here.
    const validAttributeTypes = ["class", "title", "d", "fill", "height", "style", "viewBox", "width", "id"];
    const validHtmlTags = ["code", "div", "em", "h1", "h2", "pre", "path", "span", "svg", "br"];
    // Full Regex
    const validAttribute = `(?:\\s(?:${validAttributeTypes.join("|")})=(?:"(?:${validWord})"|'(?:${validWord})'))*`;
    //
    let whitelist_production_line = [];
    for (let i = 0; i < validHtmlTags.length; i++) {
        whitelist_production_line.push(`<${validHtmlTags[i]}${validAttribute}>|<\/${validHtmlTags[i]}>`);
    }
    let whitelistRegex = new RegExp(whitelist_production_line.join("|"), "g");
    let matches = content.match(whitelistRegex);
    if (matches === null) {
        return content;
    } else {
        let extractedContent: string = "";
        let indices: number[] = [];
        for (let match of matches) {
            extractedContent += content.substr(0, content.indexOf(match))
        }
    }
}