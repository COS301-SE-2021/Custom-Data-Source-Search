import fileReadingService from "../services/FileReading.service";
import FileReadingError from "../errors/FileReadingError";
import fs from "fs";

describe('checkFileValid function', () => {
    class TestError extends Error{
        constructor(message:string, code:string) {
            super(message);
            this.code = code;
        }
        code:string;
    }
    let fileName: string = "file.txt";
    let filePath: string = "";
    function fileValid(){
        fileReadingService.checkFileValid(fileName, filePath);
    }
    it('Should throw FileReadingError with appropriate message when no file path is specified', () => {
        //given
        fileName = "file.txt";
        filePath = "";
        //then
        expect(fileValid).toThrow(FileReadingError);
        expect(fileValid).toThrow("NO FILE PATH");
    });
    it('Should throw FileReadingError with appropriate message when no file name is specified', () => {
        //given
        fileName = "";
        filePath = "/somePath";
        //then
        expect(fileValid).toThrow(FileReadingError);
        expect(fileValid).toThrow("NO FILE NAME");
    });
    it('Should throw correct error when readFileSync throws file not found error', () => {
        //given
        fileName = "file.txt";
        filePath = "/somePath";
        jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
            throw new TestError('TEST', 'ENOENT');
        });
        //then
        expect(fileValid).toThrow(FileReadingError);
        expect(fileValid).toThrow("FILE NOT FOUND");
    });
    it('Should throw correct error when readFileSync throws access prohibited error', () => {
        //given
        fileName = "file.txt";
        filePath = "/somePath";
        jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
            throw new TestError('TEST', 'EACCES');
        });
        //then
        expect(fileValid).toThrow(FileReadingError);
        expect(fileValid).toThrow("ACCESS FORBIDDEN");
    });
    it('Should pass on error when readFileSync throws error with unknown code', () => {
        //given
        fileName = "file.txt";
        filePath = "/somePath";
        jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
            throw new TestError('TEST', 'UNKNOWN');
        });
        //then
        expect(fileValid).toThrow(TestError);
        expect(fileValid).toThrow("TEST");
    });
});