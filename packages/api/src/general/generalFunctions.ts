import {randomBytes} from "crypto";

export function generateUUID(): string {
    return randomBytes(16).toString("hex");
}