import FileReadingError from "../errors/FileReadingError";

describe('FileReadingError object' , () => {
    it('Should construct error object according to the passed in parameters', () => {
        //given
        const message : string = 'message';
        const statusCode : number = 404;
        //when
        const fileReadingError = new FileReadingError(message,statusCode);
        //then
        expect(fileReadingError.message).toEqual(message);
        expect(fileReadingError.status).toEqual(statusCode);
    });

    it('Should construct error object with different properties according to the passed in parameters', () => {
        //given
        const message : string = 'other message';
        const statusCode : number = 500;
        //when
        const fileReadingError = new FileReadingError(message,statusCode);
        //then
        expect(fileReadingError.message).toEqual(message);
        expect(fileReadingError.status).toEqual(statusCode);
    });
});