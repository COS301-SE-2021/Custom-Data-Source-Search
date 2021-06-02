import TextDataSourceService from "../services/TextDataSource.service";
import {StringOccurrenceResponse} from "../models/response/searchFileResponse.interface";
//import exp from "constants";


// const mockFileContent = "Heglfgfgflgrlgg fefeff f eefef fef fefe";
// const mockSearchString = "";

const service = new TextDataSourceService();

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
});