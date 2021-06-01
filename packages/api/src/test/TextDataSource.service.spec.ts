import TextDataSourceService from "../services/TextDataSource.service";
import ExampleDataSource from "../ExampleDataSource";
import {TextDataSourceList} from "../models/TextDataSource.interface";
import {StringOccurrenceResponse} from "../models/response/searchFileResponse.interface";


const mockFileContent = "Heglfgfgflgrlgg fefeff f eefef fef fefe";
const mockSearchString = "";

const service = new TextDataSourceService();

describe('TextDataSourceService' , () => {
    it('Should store the file name', () => {
       // const exampleDataSource = new ExampleDataSource(testFilename)
     //   const textDataSources: TextDataSourceList = await TextDataSourceService.getAllTextDataSources();
        const response: StringOccurrenceResponse = service.searchFile(mockFileContent,mockSearchString);

     //   expect(testFilename).toEqual(exampleDataSource.getFileName());
    })
})