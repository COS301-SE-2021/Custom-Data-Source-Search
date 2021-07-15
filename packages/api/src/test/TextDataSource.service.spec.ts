import textDataSourceService from "../services/TextDataSource.service";
import {StringOccurrences} from "../models/response/searchFileResponse.interface";
import fs from "fs";
import textDataSourceRepository from "../repositories/TextDataSourceRepository";

const service = textDataSourceService;

describe('TextDataSourceService : Individual File Searching', () => {
    it('Should return empty object on empty string search', () => {
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
        const mockSearchString = "";
        //when
        const response: StringOccurrences = service.searchFile(mockFileContent, mockSearchString);
        //then
        expect(response).toEqual({});
    });

    it('Should return empty object when searching for a string that is not contained in the file content', () => {
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
        const mockSearchString = "Gelato";
        //when
        const response: StringOccurrences = service.searchFile(mockFileContent, mockSearchString);
        //then
        expect(response).toEqual({});
    });

    it('Should return one occurrence that contains the search string when file content contains the search string', () => {
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, Gelato consectetur adipiscing elit.";
        const mockSearchString = "Gelato";
        //when
        const response: StringOccurrences = service.searchFile(mockFileContent, mockSearchString);
        //then
        expect(response).not.toEqual({});
        expect(response[0]).not.toBe(undefined);
        expect(response[0].occurrenceString).toContain(mockSearchString);
        expect(response[1]).toBe(undefined);
    });

    it('Should return two different occurrences of search string when file content contains two occurrences of the search string', () => {
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, Gelato consectetur adipiscing elit.\nMaecenas at sagittis eros. Gelato Duis at velit vel est vestibulum laoreet.";
        const mockSearchString = "Gelato";
        //when
        const response: StringOccurrences = service.searchFile(mockFileContent, mockSearchString);
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
        const response: StringOccurrences = service.searchFile(mockFileContent, mockSearchString);
        //then
        expect(response).toEqual({});
    });

    it('Should return occurrences on different lines for Windows if the file contains multiple lines with occurrences on them', () => {
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, Gelato consectetur adipiscing elit.\r\nMaecenas at sagittis eros. Gelato Duis at velit vel est vestibulum laoreet.";
        const mockSearchString = "Gelato";
        //when
        const response: StringOccurrences = service.searchFile(mockFileContent, mockSearchString);
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
        const response: StringOccurrences = service.searchFile(mockFileContent, mockSearchString);
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
        const response: StringOccurrences = service.searchFile(mockFileContent, mockSearchString);
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


describe('TextDataSourceService : Searching Across All Files', () => {
    beforeAll(() => {
        jest.spyOn(textDataSourceRepository, 'getAllDataSources').mockImplementation(() => {
            return [
                [
                    {uuid: 'notsorandomuuid', filename: 'hello.txt', path: '../test/'},
                    {uuid: 'notsorandomuuid2', filename: 'beans.txt', path: '../test/'}
                ], null];
        });
    })
    it('Should return empty object when no occurrences of the search string are in any files ', async () => {
        //given
        const searchString = "awordthatshouldntbethere";
        //when
        const [response, error] = await service.searchAllTextDataSources(searchString);
        //then
        expect(error).toBe(null);
        expect(response).not.toBe(null);
        expect(response).toEqual({});
    });
});

describe('TextDataSourceService : addTextDataSource function', () => {
    class TestError extends Error {
        constructor(message: string, code: string) {
            super(message);
            this.code = code;
        }

        code: string;
    }

    let fileName: string = "";
    let filePath: string = "";

    // async function add() {
    //     await service.addTextDataSource(fileName, filePath);
    // }

    it('Should make a call to text repository to store valid datasource', async () => {
        //given
        fileName = "file.txt";
        filePath = "valid/path/";
        jest.spyOn(fs, "readFileSync").mockReturnValue("Some unimportant content");
        jest.spyOn(textDataSourceRepository, "addDataSource").mockImplementation(async() => {return [null, null]});
        //when
        const [, error] = await service.addTextDataSource(fileName, filePath);
        expect(error).toEqual(null);
        //then
        expect(textDataSourceRepository.addDataSource).toBeCalledWith({filename: fileName, path: filePath});
    });
    it('Should throw FileReadingError with appropriate message when datasource already exists', async () => {
        //given
        fileName = "file.txt";
        filePath = "valid/path/";
        jest.spyOn(fs, "readFileSync").mockReturnValue("Some unimportant content");
        jest.spyOn(textDataSourceRepository, "addDataSource").mockImplementation(async() => {return [null, {
            "code": 400,
            "message": "already exists"
        }]});
        //when
        const [, error] = await service.addTextDataSource(fileName, filePath);
        //then
        expect(error).toEqual({
            "code": 400,
            "message": "Datasource already exists"
        });
    });
    it('Should throw FileReadingError with appropriate message when no file path is specified', async () => {
        //given
        fileName = "file.txt";
        filePath = "";
        //when
        const [, error] = await service.addTextDataSource(fileName, filePath);
        //then
        expect(error).toEqual({
            "code": 400,
            "message": "No file path"
        });
    });
    it('Should throw FileReadingError with appropriate message when no file name is specified', async () => {
        //given
        fileName = "";
        filePath = "/somePath";
        //when
        const [, error] = await service.addTextDataSource(fileName, filePath);
        //then
        expect(error).toEqual({
            "code": 400,
            "message": "No file name"
        });
    });
    it('Should throw correct error when readFileSync throws file not found error', async () => {
        //given
        fileName = "file.txt";
        filePath = "/somePath";
        jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
            throw new TestError('TEST', 'ENOENT');
        });
        //when
        const [, error] = await service.addTextDataSource(fileName, filePath);
        //then
        expect(error).toEqual({
            "code": 404,
            "message": "File not found"
        });
    });
    it('Should throw correct error when readFileSync throws access prohibited error', async () => {
        //given
        fileName = "file.txt";
        filePath = "/somePath";
        jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
            throw new TestError('TEST', 'EACCES');
        });
        //when
        const [, error] = await service.addTextDataSource(fileName, filePath);
        //then
        expect(error).toEqual({
            "code": 403,
            "message": "Access forbidden"
        });
    });
    it('Should pass on error when readFileSync throws error with unknown code', async () => {
        //given
        fileName = "file.txt";
        filePath = "/somePath";
        jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
            throw new TestError('TEST', 'UNKNOWN');
        });
        //when
        const [, error] = await service.addTextDataSource(fileName, filePath);
        //then
        expect(error).toEqual({
            "code": 500,
            "message": "Unknown error"
        });
    });
});
describe('TextDataSourceService : removeTextDataSource function', () => {
    it("Should return results returned by repository upon successful deletion of datasource", () => {
        //given
        const message: string = "Successfully deleted Text datasource";
        jest.spyOn(textDataSourceRepository, "deleteDataSource").mockReturnValue([{
            "code": 204,
            "message": message
        }, null]);
        const id: string = "testUUID";
        //when
        const result = textDataSourceService.removeTextDataSource(id);
        //then
        expect(textDataSourceRepository.deleteDataSource).toBeCalledWith(id);
        expect(result.code).toEqual(204);
        expect(result.body.message).toEqual(message);
    });
    it("Should return appropriate error if error occurred inside repository while deleting", () => {
        //given
        const errorCode: number = 42;
        const errorMessage: string = "some error";
        jest.spyOn(textDataSourceRepository, "deleteDataSource").mockReturnValue([null, {
            "code": errorCode,
            "message": errorMessage
        }]);
        const id: string = "testUUID";
        //when
        const result = textDataSourceService.removeTextDataSource(id);
        //then
        expect(textDataSourceRepository.deleteDataSource).toBeCalledWith(id);
        expect(result.code).toEqual(errorCode);
        expect(result.body).toEqual({
            "message": errorMessage
        });
    });
});
describe('TextDataSourceService : getAllTextDataSources function', () => {
    it("Should return results returned by repository if no error occurred", () => {
        //given
        const response = [
            {
                "uuid": "testUUID1",
                "filename": "file1.txt",
                "path": "some/path/"
            },
            {
                "uuid": "testUUID2",
                "filename": "file2.txt",
                "path": "some/other/path/"
            }
        ];
        jest.spyOn(textDataSourceRepository, "getAllDataSources").mockReturnValue([response, null]);
        //when
        const result = textDataSourceService.getAllTextDataSources()
        //then
        expect(result.code).toEqual(200);
        expect(result.body).toEqual(response);
    });
    it("Should return appropriate error if error occurred inside repository", () => {
        //given
        jest.spyOn(textDataSourceRepository, "getAllDataSources").mockReturnValue([null, {
            "code": 500,
            "message": "some unknown error"
        }]);
        //when
        const result = textDataSourceService.getAllTextDataSources()
        //then
        expect(result.code).toEqual(500);
        expect(result.body).toEqual({
            "message": "Internal error"
        });
    });
});
describe('TextDataSourceService : getTextDataSource function', () => {
    it("Should return requested datasource if repository finds it", () => {
        //given
        const response = {
            "uuid": "testUUID1",
            "filename": "file1.txt",
            "path": "some/path/"
        };
        jest.spyOn(textDataSourceRepository, "getDataSource").mockReturnValue([response, null]);
        const id: string = "testUUID1";
        //when
        const result = textDataSourceService.getTextDataSource(id);
        //then
        expect(textDataSourceRepository.getDataSource).toBeCalledWith(id);
        expect(result.code).toEqual(200);
        expect(result.body).toEqual({
            "message": "Success",
            "data": response
        })
    });
    it("Should return corresponding error returned by repository", () => {
        //given
        const errorCode = 42;
        const errorMessage = "Some very unique error message";
        jest.spyOn(textDataSourceRepository, "getDataSource").mockReturnValue([null, {
            "code": errorCode,
            "message": errorMessage
        }]);
        const id: string = "testUUID1";
        //when
        const result = textDataSourceService.getTextDataSource(id);
        //then
        expect(textDataSourceRepository.getDataSource).toBeCalledWith(id);
        expect(result.code).toEqual(errorCode);
        expect(result.body.message).toEqual(errorMessage);
    });
});
describe('TextDataSourceService : readFile function', () => {
    it("Should reject with a promise if fs failed to read file", async () => {
        //given
        const filePath: string = "some, invalid file path";
        //then
        await expect(textDataSourceService.readFile(filePath)).rejects.not.toEqual("this");
    });
});
