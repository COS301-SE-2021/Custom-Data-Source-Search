import TextDataSourceService from "../services/TextDataSource.service";
import {StringOccurrenceResponse} from "../models/response/searchFileResponse.interface";


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
    })
})