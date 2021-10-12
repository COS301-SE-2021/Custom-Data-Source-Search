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
            } else if (type === "role") {
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
        let matchIndices: number[] = new Array(matches.length);
        for (let i: number = 0; i < matches.length; i++) {
            matchIndices[i] = 0;
        }
        for (let i: number = 0; i < matches.length; i++) {
            const index: number = content.indexOf(matches[i]);
            extractedContent += content.substr(0, index);
            content = content.substr(index + matches[i].length);
            for (let j: number = i; j < matches.length; j++) {
                matchIndices[j] += index;
            }
        }
        searchTerms.sort(function (a, b) {
            return b.length - a.length;
        });
        let positions: { start: number; end: number }[] = [];
        for (let term of searchTerms) {
            let index: number = extractedContent.indexOf(term);
            while (index !== -1) {
                if (!contained(positions, {start: index, end: index + term.length})) {
                    positions.push({start: index, end: index + term.length});
                }
                index = extractedContent.indexOf(term, index + 1);
            }
        }
        positions.sort(function (a, b) {
            return a.start - b.start;
        })
        const openingLength: number = '<span style=\u0027background-color: #0073ff;color: white;\u0027>'.length;
        const closingLength: number = '</span>'.length;
        const extraLengthFromHighlighting: number = openingLength + closingLength;
        let finalContent: string = extractedContent;
        for (let posIndex: number = 0; posIndex < positions.length; posIndex++) {
            for (let i: number = 0; i < matchIndices.length; i++) {
                if (matchIndices[i] > positions[posIndex].start && matchIndices[i] < positions[posIndex].end) {
                    finalContent = insertHighlight(positions[posIndex].start, matchIndices[i], finalContent);
                    matchIndices = updateIndicesFrom(i, matchIndices, extraLengthFromHighlighting);
                    positions[posIndex].end += extraLengthFromHighlighting;
                    updatePositionsFrom(posIndex + 1, positions, extraLengthFromHighlighting);
                    i++;
                    while (i < matchIndices.length && matchIndices[i] < positions[posIndex].end) {
                        finalContent = insertHighlight(matchIndices[i-1], matchIndices[i], finalContent);
                        matchIndices = updateIndicesFrom(i, matchIndices, extraLengthFromHighlighting);
                        positions[posIndex].end += extraLengthFromHighlighting;
                        updatePositionsFrom(posIndex + 1, positions, extraLengthFromHighlighting);
                        i++;
                    }
                    finalContent = insertHighlight(matchIndices[i-1], positions[posIndex].end, finalContent);
                    matchIndices = updateIndicesFrom(i, matchIndices, extraLengthFromHighlighting);
                    updatePositionsFrom(posIndex + 1, positions, extraLengthFromHighlighting);
                    break;
                } else if (matchIndices[i] >= positions[posIndex].end) {
                    finalContent = insertHighlight(positions[posIndex].start, positions[posIndex].end, finalContent);
                    matchIndices = updateIndicesFrom(i, matchIndices, extraLengthFromHighlighting);
                    updatePositionsFrom(posIndex + 1, positions, extraLengthFromHighlighting);
                    break;
                }
            }
        }
        let formattedFinalContent: string = "";
        let startIndex: number = 0;
        for (let matchIndex: number = 0; matchIndex < matches.length; matchIndex++) {
            formattedFinalContent += finalContent.substring(startIndex, matchIndices[matchIndex]) + matches[matchIndex];
            startIndex = matchIndices[matchIndex];
        }
        formattedFinalContent += finalContent.substr(startIndex);
        return formattedFinalContent;
    }
}

function insertHighlight(startIndex: number, endIndex: number, content: string): string {
    return content.substring(0, startIndex) +
        '<span style=\u0027background-color: #0073ff;color: white;\u0027>' +
        content.substring(startIndex, endIndex) +
        '</span>' +
        content.substr(endIndex);
}

function updatePositionsFrom(index: number, positions: { start: number; end: number }[], amount: number): void {
    for (; index < positions.length; index++) {
        positions[index].start += amount;
        positions[index].end += amount;
    }
}

function updateIndicesFrom(index: number, indices: number[], amount: number): number[] {
    for (; index < indices.length; index++) {
        indices[index] += amount;
    }
    return indices;
}

function contained(positions: { start: number; end: number }[], newPosition: { start: number; end: number }): boolean {
    for (let pos of positions) {
        if (pos.start <= newPosition.start && newPosition.start <= pos.end) {
            return true;
        }
        if (pos.start <= newPosition.end && newPosition.end <= pos.end) {
            return true;
        }
    }
    return false;
}