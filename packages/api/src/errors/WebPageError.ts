class WebPageUnavailableError extends Error{
    constructor(message : string, httpCode : number) {
        super(message);
        this.status = httpCode;
    }
    status :number;
}

export default WebPageUnavailableError;