import textDataSourceService from "../services/TextDataSource.service";
import {StringOccurrenceResponse} from "../models/response/searchFileResponse.interface";
//import exp from "constants";


// const mockFileContent = "Heglfgfgflgrlgg fefeff f eefef fef fefe";
// const mockSearchString = "";

const service = textDataSourceService;

describe('TextDataSourceService' , () => {
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
        expect(response[0]).not.toBeNaN();
        expect(response[0].occurrenceString).toContain(mockSearchString);
        expect(response[1]).toBeNaN();
    });

    it('Should return two different occurrence that contains the search string when file content contains two different instances of the search string', () =>{
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, Gelato consectetur adipiscing elit.\nMaecenas at sagittis eros. Gelato Duis at velit vel est vestibulum laoreet.";
        const mockSearchString = "Gelato";
        //when
        const response: StringOccurrenceResponse = service.searchFile(mockFileContent,mockSearchString);
        //then
        expect(response).not.toEqual({});
        expect(response[0]).not.toBeNaN();
        expect(response[0].occurrenceString).toContain(mockSearchString);

        expect(response[1]).not.toBeNaN();
        expect(response[1].occurrenceString).toContain(mockSearchString);
        expect(response[2]).toBeNaN();
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
});