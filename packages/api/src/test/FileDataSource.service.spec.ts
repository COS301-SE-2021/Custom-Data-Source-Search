import fileDataSourceService from "../services/FileDataSource.service";
import {StringOccurrence} from "../models/response/searchFileResponse.interface";
import fs from "fs";
import fileDataSourceRepository from "../repositories/FileDataSourceRepository";

const service = fileDataSourceService;

describe('FileDataSourceService : Individual File Searching', () => {
    it('Should return empty object on empty string search', () => {
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
        const mockSearchString = "";
        //when
        const response: StringOccurrence[] = service.searchFile(mockFileContent, mockSearchString);
        //then
        expect(response).toEqual([]);
    });

    it('Should return empty object when searching for a string that is not contained in the file content', () => {
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
        const mockSearchString = "Gelato";
        //when
        const response: StringOccurrence[] = service.searchFile(mockFileContent, mockSearchString);
        //then
        expect(response).toEqual([]);
    });

    it('Should return one occurrence that contains the search string when file content contains the search string', () => {
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, Gelato consectetur adipiscing elit.";
        const mockSearchString = "Gelato";
        //when
        const response: StringOccurrence[] = service.searchFile(mockFileContent, mockSearchString);
        //then
        expect(response).not.toEqual([]);
        expect(response[0]).not.toBe(undefined);
        expect(response[0].occurrenceString).toContain(mockSearchString);
        expect(response[1]).toBe(undefined);
    });

    it('Should return two different occurrences of search string when file content contains two occurrences of the search string', () => {
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, Gelato consectetur adipiscing elit.\nMaecenas at sagittis eros. Gelato Duis at velit vel est vestibulum laoreet.";
        const mockSearchString = "Gelato";
        //when
        const response: StringOccurrence[] = service.searchFile(mockFileContent, mockSearchString);
        //then
        expect(response).not.toEqual([]);
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
        const response: StringOccurrence[] = service.searchFile(mockFileContent, mockSearchString);
        //then
        expect(response).toEqual([]);
    });

    it('Should return occurrences on different lines for Windows if the file contains multiple lines with occurrences on them', () => {
        //given
        const mockFileContent = "Lorem ipsum dolor sit amet, Gelato consectetur adipiscing elit.\r\nMaecenas at sagittis eros. Gelato Duis at velit vel est vestibulum laoreet.";
        const mockSearchString = "Gelato";
        //when
        const response: StringOccurrence[] = service.searchFile(mockFileContent, mockSearchString);
        //then
        expect(response).not.toEqual([]);
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
        const response: StringOccurrence[] = service.searchFile(mockFileContent, mockSearchString);
        //then
        expect(response).not.toEqual([]);
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
        const response: StringOccurrence[] = service.searchFile(mockFileContent, mockSearchString);
        //then
        expect(response).not.toEqual([]);
        expect(response[0]).not.toBe(undefined);
        expect(response[0].occurrenceString).toContain(mockSearchString);
        expect(response[0].lineNumber).toEqual(1);

        expect(response[1]).not.toBe(undefined);
        expect(response[1].occurrenceString).toContain(mockSearchString);
        expect(response[1].lineNumber).toEqual(2);
        expect(response[2]).toBe(undefined);
    });
});


describe('FileDataSourceService : Searching Across All Files', () => {
    beforeAll(() => {
        jest.spyOn(fileDataSourceRepository, 'getAllDataSources').mockImplementation(() => {
            return [
                [
                    {uuid: 'notsorandomuuid', filename: 'hello.txt', path: '../test/', lastModified: new Date()},
                    {uuid: 'notsorandomuuid2', filename: 'beans.txt', path: '../test/', lastModified: new Date()}
                ], null];
        });
    })
    it('Should return empty object when no occurrences of the search string are in any files ', async () => {
        //given
        const searchString = "awordthatshouldntbethere";
        //when
        const [response, error] = await service.searchAllFileDataSources(searchString);
        //then
        expect(error).toBe(null);
        expect(response).not.toBe(null);
        expect(response).toEqual([]);
    });
});

describe('FileDataSourceService : addFileDataSource function', () => {
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
    //     await service.addFileDataSource(fileName, filePath);
    // }

    it('Should make a call to file repository to store valid datasource', async () => {
        //given
        fileName = "file.txt";
        filePath = "valid/path/";
        jest.spyOn(fs, "readFileSync").mockReturnValue("Some unimportant content");
        jest.spyOn(fileDataSourceRepository, "addDataSource").mockImplementation(async() => {return [null, null]});
        //when
        const [, error] = await service.addFileDataSource(fileName, filePath);
        expect(error).toEqual(null);
        //then
        expect(fileDataSourceRepository.addDataSource).toBeCalledWith({filename: fileName, path: filePath});
    });
    it('Should return error with appropriate message when datasource already exists', async () => {
        //given
        fileName = "file.txt";
        filePath = "valid/path/";
        jest.spyOn(fs, "readFileSync").mockReturnValue("Some unimportant content");
        jest.spyOn(fileDataSourceRepository, "addDataSource").mockImplementation(async() => {return [null, {
            "code": 400,
            "message": "File datasource already exists"
        }]});
        //when
        const [, error] = await service.addFileDataSource(fileName, filePath);
        //then
        expect(error).toEqual({
            "code": 400,
            "message": "File datasource already exists"
        });
    });
    it('Should throw FileReadingError with appropriate message when no file path is specified', async () => {
        //given
        fileName = "file.txt";
        filePath = "";
        //when
        const [, error] = await service.addFileDataSource(fileName, filePath);
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
        const [, error] = await service.addFileDataSource(fileName, filePath);
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
        const [, error] = await service.addFileDataSource(fileName, filePath);
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
        const [, error] = await service.addFileDataSource(fileName, filePath);
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
        const [, error] = await service.addFileDataSource(fileName, filePath);
        //then
        expect(error).toEqual({
            "code": 500,
            "message": "Unknown error"
        });
    });
});
describe('FileDataSourceService : removeFileDataSource function', () => {
    it("Should return results returned by repository upon successful deletion of datasource", () => {
        //given
        const message: string = "Successfully deleted File datasource";
        jest.spyOn(fileDataSourceRepository, "deleteDataSource").mockReturnValue([{
            "code": 204,
            "message": message
        }, null]);
        const id: string = "testUUID";
        //when
        const result = fileDataSourceService.removeFileDataSource(id);
        //then
        expect(fileDataSourceRepository.deleteDataSource).toBeCalledWith(id);
        expect(result.code).toEqual(204);
        expect(result.body.message).toEqual(message);
    });
    it("Should return appropriate error if error occurred inside repository while deleting", () => {
        //given
        const errorCode: number = 42;
        const errorMessage: string = "some error";
        jest.spyOn(fileDataSourceRepository, "deleteDataSource").mockReturnValue([null, {
            "code": errorCode,
            "message": errorMessage
        }]);
        const id: string = "testUUID";
        //when
        const result = fileDataSourceService.removeFileDataSource(id);
        //then
        expect(fileDataSourceRepository.deleteDataSource).toBeCalledWith(id);
        expect(result.code).toEqual(errorCode);
        expect(result.body).toEqual({
            "message": errorMessage
        });
    });
});
describe('FileDataSourceService : getAllFileDataSources function', () => {
    it("Should return results returned by repository if no error occurred", () => {
        //given
        const response = [
            {
                "uuid": "testUUID1",
                "filename": "file1.txt",
                "path": "some/path/",
                "lastModified": new Date()
            },
            {
                "uuid": "testUUID2",
                "filename": "file2.txt",
                "path": "some/other/path/",
                "lastModified": new Date()
            }
        ];
        jest.spyOn(fileDataSourceRepository, "getAllDataSources").mockReturnValue([response, null]);
        //when
        const result = fileDataSourceService.getAllFileDataSources()
        //then
        expect(result.code).toEqual(200);
        expect(result.body).toEqual(response);
    });
    it("Should return appropriate error if error occurred inside repository", () => {
        //given
        jest.spyOn(fileDataSourceRepository, "getAllDataSources").mockReturnValue([null, {
            "code": 500,
            "message": "some unknown error"
        }]);
        //when
        const result = fileDataSourceService.getAllFileDataSources()
        //then
        expect(result.code).toEqual(500);
        expect(result.body).toEqual({
            "message": "Internal error"
        });
    });
});
describe('FileDataSourceService : getFileDataSource function', () => {
    it("Should return requested datasource if repository finds it", () => {
        //given
        const response = {
            "uuid": "testUUID1",
            "filename": "file1.txt",
            "path": "some/path/",
            "lastModified": new Date()
        };
        jest.spyOn(fileDataSourceRepository, "getDataSource").mockReturnValue([response, null]);
        const id: string = "testUUID1";
        //when
        const result = fileDataSourceService.getFileDataSource(id);
        //then
        expect(fileDataSourceRepository.getDataSource).toBeCalledWith(id);
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
        jest.spyOn(fileDataSourceRepository, "getDataSource").mockReturnValue([null, {
            "code": errorCode,
            "message": errorMessage
        }]);
        const id: string = "testUUID1";
        //when
        const result = fileDataSourceService.getFileDataSource(id);
        //then
        expect(fileDataSourceRepository.getDataSource).toBeCalledWith(id);
        expect(result.code).toEqual(errorCode);
        expect(result.body.message).toEqual(errorMessage);
    });
});
describe('FileDataSourceService : readFile function', () => {
    it("Should reject with a promise if fs failed to read file", async () => {
        //given
        const filePath: string = "some, invalid file path";
        //then
        await expect(fileDataSourceService.readFile(filePath)).rejects.not.toEqual("this");
    });
});