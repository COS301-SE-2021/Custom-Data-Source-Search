export interface StatusMessage {
    code: number;
    message: string;
}

export interface DefaultHttpResponse {
    code: number;
    body: { message: string; }
}