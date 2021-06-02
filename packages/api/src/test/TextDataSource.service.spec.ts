import textDataSourceService from "../services/TextDataSource.service";
import {StringOccurrenceResponse} from "../models/response/searchFileResponse.interface";
import FileReadingError from "../errors/FileReadingError";
//import exp from "constants";


// const mockFileContent = "Heglfgfgflgrlgg fefeff f eefef fef fefe";
// const mockSearchString = "";

const service = textDataSourceService;

describe('searchFile function' , () => {
    it('Should return empty object on empty string search', () => {
       // const exampleDataSource = new ExampleDataSource(testFilename)
     //   const textDataSources: TextDataSourceList = await TextDataSourceService.getAllTextDataSources();
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
        const mockSearchString = "";
        //when
        const response: StringOccurrenceResponse = service.searchFile(mockFileContent,mockSearchString);
        //then
        expect(response).toEqual({});
     //   expect(testFilename).toEqual(exampleDataSource.getFileName());
    });

    it('Should return empty object when searching for a string that is not contained in the file content', () =>{
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
        const mockSearchString = "Gelato";
        //when
        const response: StringOccurrenceResponse = service.searchFile(mockFileContent,mockSearchString);
        //then
        expect(response).toEqual({});
    });

    it('Should return one occurrence that contains the search string when file content contains the search string', () =>{
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, Gelato consectetur adipiscing elit.";
        const mockSearchString = "Gelato";
        //when
        const response: StringOccurrenceResponse = service.searchFile(mockFileContent,mockSearchString);
        //then
        expect(response).not.toEqual({});
        expect(response[0]).not.toBe(undefined);
        expect(response[0].occurrenceString).toContain(mockSearchString);
        expect(response[1]).toBe(undefined);
    });

    it('Should return two different occurrence that contains the search string when file content contains two different instances of the search string', () =>{
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, Gelato consectetur adipiscing elit.\nMaecenas at sagittis eros. Gelato Duis at velit vel est vestibulum laoreet.";
        const mockSearchString = "Gelato";
        //when
        const response: StringOccurrenceResponse = service.searchFile(mockFileContent,mockSearchString);
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
        const response: StringOccurrenceResponse = service.searchFile(mockFileContent,mockSearchString);
        //then
        expect(response).toEqual({});
    });

    it('Should return occurrences on different lines for windows if the file contains multiple lines with occurrences on them', () => {
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, Gelato consectetur adipiscing elit.\r\nMaecenas at sagittis eros. Gelato Duis at velit vel est vestibulum laoreet.";
        const mockSearchString = "Gelato";
        //when
        const response: StringOccurrenceResponse = service.searchFile(mockFileContent,mockSearchString);
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
        const response: StringOccurrenceResponse = service.searchFile(mockFileContent,mockSearchString);
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
        const response: StringOccurrenceResponse = service.searchFile(mockFileContent,mockSearchString);
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

describe('addTextDataSource function' , () => {
    it('Should throw FileReadingError with appropriate message when no file path is specified', () => {
        //given
        const fileName = "file.txt";
        const filePath = "";
        //when
        function add(){
            service.addTextDataSource(fileName, filePath);
        }
        //then
        expect(add).toThrow(FileReadingError);
        expect(add).toThrow("NO FILE PATH");
    });
    it('Should throw FileReadingError with appropriate message when no file name is specified', () => {
        //given
        const fileName = "";
        const filePath = "/somePath";
        //when
        function add(){
            service.addTextDataSource(fileName, filePath);
        }
        //then
        expect(add).toThrow(FileReadingError);
        expect(add).toThrow("NO FILE NAME");
    });
});