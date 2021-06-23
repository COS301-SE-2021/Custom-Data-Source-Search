import textDataSourceService from "../services/TextDataSource.service";
import {StringOccurrences} from "../models/response/searchFileResponse.interface";
import FileReadingError from "../errors/FileReadingError";
import fs from "fs";
import textDataSourceRepository from "../repositories/TextDataSourceRepository";

const service = textDataSourceService;

describe('TextDataSourceService : Individual File Searching' , () => {
    it('Should return empty object on empty string search', () => {
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
        const mockSearchString = "";
        //when
        const response: StringOccurrences = service.searchFile(mockFileContent,mockSearchString);
        //then
        expect(response).toEqual({});
    });

    it('Should return empty object when searching for a string that is not contained in the file content', () =>{
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
        const mockSearchString = "Gelato";
        //when
        const response: StringOccurrences = service.searchFile(mockFileContent,mockSearchString);
        //then
        expect(response).toEqual({});
    });

    it('Should return one occurrence that contains the search string when file content contains the search string', () =>{
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, Gelato consectetur adipiscing elit.";
        const mockSearchString = "Gelato";
        //when
        const response: StringOccurrences = service.searchFile(mockFileContent,mockSearchString);
        //then
        expect(response).not.toEqual({});
        expect(response[0]).not.toBe(undefined);
        expect(response[0].occurrenceString).toContain(mockSearchString);
        expect(response[1]).toBe(undefined);
    });

    it('Should return two different occurrences of search string when file content contains two occurrences of the search string', () =>{
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, Gelato consectetur adipiscing elit.\nMaecenas at sagittis eros. Gelato Duis at velit vel est vestibulum laoreet.";
        const mockSearchString = "Gelato";
        //when
        const response: StringOccurrences = service.searchFile(mockFileContent,mockSearchString);
        //then
        expect(response).not.toEqual({});
        expect(response[0]).not.toBe(undefined);
        expect(response[0].occurrenceString).toContain(mockSearchString);

        expect(response[1]).not.toBe(undefined);
        expect(response[1].occurrenceString).toContain(mockSearchString);
        expect(response[2]).toBe(undefined);
    });

    it('Should return empty object if the file content is empty', () => {
        //given
        const mockFileContent = "";
        const mockSearchString = "Gelato";
        //when
        const response: StringOccurrences = service.searchFile(mockFileContent,mockSearchString);
        //then
        expect(response).toEqual({});
    });

    it('Should return occurrences on different lines for Windows if the file contains multiple lines with occurrences on them', () => {
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, Gelato consectetur adipiscing elit.\r\nMaecenas at sagittis eros. Gelato Duis at velit vel est vestibulum laoreet.";
        const mockSearchString = "Gelato";
        //when
        const response: StringOccurrences = service.searchFile(mockFileContent,mockSearchString);
        //then
        expect(response).not.toEqual({});
        expect(response[0]).not.toBe(undefined);
        expect(response[0].occurrenceString).toContain(mockSearchString);
        expect(response[0].lineNumber).toEqual(1);

        expect(response[1]).not.toBe(undefined);
        expect(response[1].occurrenceString).toContain(mockSearchString);
        expect(response[1].lineNumber).toEqual(2);
        expect(response[2]).toBe(undefined);
    });

    it('Should return occurrences on different lines for Linux if the file contains multiple lines with occurrences on them', () => {
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, Gelato consectetur adipiscing elit.\nMaecenas at sagittis eros. Gelato Duis at velit vel est vestibulum laoreet.";
        const mockSearchString = "Gelato";
        //when
        const response: StringOccurrences = service.searchFile(mockFileContent,mockSearchString);
        //then
        expect(response).not.toEqual({});
        expect(response[0]).not.toBe(undefined);
        expect(response[0].occurrenceString).toContain(mockSearchString);
        expect(response[0].lineNumber).toEqual(1);

        expect(response[1]).not.toBe(undefined);
        expect(response[1].occurrenceString).toContain(mockSearchString);
        expect(response[1].lineNumber).toEqual(2);
        expect(response[2]).toBe(undefined);
    });

    it('Should return occurrences on different lines for older mac if the file contains multiple lines with occurrences on them', () => {
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, Gelato consectetur adipiscing elit.\rMaecenas at sagittis eros. Gelato Duis at velit vel est vestibulum laoreet.";
        const mockSearchString = "Gelato";
        //when
        const response: StringOccurrences = service.searchFile(mockFileContent,mockSearchString);
        //then
        expect(response).not.toEqual({});
        expect(response[0]).not.toBe(undefined);
        expect(response[0].occurrenceString).toContain(mockSearchString);
        expect(response[0].lineNumber).toEqual(1);

        expect(response[1]).not.toBe(undefined);
        expect(response[1].occurrenceString).toContain(mockSearchString);
        expect(response[1].lineNumber).toEqual(2);
        expect(response[2]).toBe(undefined);
    });
});


describe('TextDataSourceService : Searching Across All Files' , () => {
    beforeAll(() => {
        jest.spyOn(textDataSourceRepository, 'getAllDataSources').mockImplementation(() => {
            return [
                [
                    {uuid: 'notsorandomuuid', filename: 'hello.txt', path: '../test/'},
                    {uuid: 'notsorandomuuid2', filename: 'beans.txt', path: '../test/'}
                ], null];
        });
    })
    it('Should return search results when there are multiple occurrences of the search string in any files ', async () => {
        //given
        const searchString = "Jeff";
        //when
        const [response,error] = await service.searchAllTextDataSources(searchString);
        //then
        expect(error).toBe(null);
        expect(response).not.toBe(null);
        expect(response).not.toEqual({});
        if (response) {
            //hello.txt
            expect(response[0]).not.toBe(undefined);
            expect(response[0].source).toEqual("../test/hello.txt");
            expect(response[0]["occurrences"][0].lineNumber).toEqual(1);
            expect(response[0]["occurrences"][1].lineNumber).toEqual(3);
            expect(response[0]["occurrences"][2].lineNumber).toEqual(5);
            //beans.txt
            expect(response[1]).not.toBe(undefined);
            expect(response[1].source).toEqual("../test/beans.txt");
            expect(response[1]["occurrences"][0].lineNumber).toEqual(5);
            expect(response[1]["occurrences"][1].lineNumber).toEqual(6);
        }
    });

    it('Should return empty object when no occurrences of the search string are in any files ', async () => {
        //given
        const searchString = "awordthatshouldntbethere";
        //when
        const [response,error] = await service.searchAllTextDataSources(searchString);
        //then
        expect(error).toBe(null);
        expect(response).not.toBe(null);
        expect(response).toEqual({});
    });
});

describe('addTextDataSource function' , () => {
    class TestError extends Error{
        constructor(message:string, code:string) {
            super(message);
            this.code = code;
        }
        code:string;
    }
    let fileName: string = "";
    let filePath: string = "";
    function add(){
        service.addTextDataSource(fileName, filePath);
    }
    it('Should throw FileReadingError with appropriate message when no file path is specified', () => {
        //given
        fileName = "file.txt";
        filePath = "";
        //then
        expect(add).toThrow(FileReadingError);
        expect(add).toThrow("NO FILE PATH");
    });
    it('Should throw FileReadingError with appropriate message when no file name is specified', () => {
        //given
        fileName = "";
        filePath = "/somePath";
        //then
        expect(add).toThrow(FileReadingError);
        expect(add).toThrow("NO FILE NAME");
    });
    it('Should throw correct error when readFileSync throws file not found error', () => {
        //given
        fileName = "file.txt";
        filePath = "/somePath";
        jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
            throw new TestError('TEST', 'ENOENT');
        });
        expect(add).toThrow(FileReadingError);
        expect(add).toThrow("FILE NOT FOUND");
    });
    it('Should throw correct error when readFileSync throws access prohibited error', () => {
        //given
        fileName = "file.txt";
        filePath = "/somePath";
        jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
            throw new TestError('TEST', 'EACCES');
        });
        //then
        expect(add).toThrow(FileReadingError);
        expect(add).toThrow("ACCESS FORBIDDEN");
    });
    it('Should pass on error when readFileSync throws error with unknown code', () => {
        //given
        fileName = "file.txt";
        filePath = "/somePath";
        jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
            throw new TestError('TEST', 'UNKNOWN');
        });
        //then
        expect(add).toThrow(TestError);
        expect(add).toThrow("TEST");
    });
});