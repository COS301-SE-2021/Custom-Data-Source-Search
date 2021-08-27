import {randomBytes} from "crypto";
import fs from "fs";
import {DefaultHttpResponse, StatusMessage} from "../models/response/general.interfaces";

export function generateUUID(): string {
    return randomBytes(16).toString("hex");
}

export function getLastModifiedDateOfFile(filePath: string): Date {
    try {
        return fs.statSync(filePath).mtime;
    } catch (e) {
        return new Date();
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