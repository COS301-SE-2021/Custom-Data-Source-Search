import fileDataSourceService from "../../services/FileDataSource.service";
import fileDataSourceRepository from "../../repositories/FileDataSourceRepository";
import {FileDataSource} from "../../models/FileDataSource.interface";
import solrService from "../../services/Solr.service";
import {statusMessage} from "../../general/generalFunctions";

const service = fileDataSourceService;

describe('FileDataSourceService : addFileDataSource function', () => {
    it('Should make a call to file repository to store valid datasource', async () => {
        //given
        let dataSource: FileDataSource = {
            "filename": "file.txt",
            "file": Buffer.from("File Content"),
            "path": "valid/path/",
            "tag1": "tag",
            "tag2": "tag"
        }
        jest.spyOn(fileDataSourceRepository, "addDataSource").mockImplementationOnce(() => {
            return [statusMessage(200, "Success"), null]
        });
        jest.spyOn(solrService, "postToSolr").mockImplementationOnce(async () => {
            return [statusMessage(200, "Success"), null];
        });
        jest.spyOn(fileDataSourceService, "validateDataSource").mockReturnValue(
            [statusMessage(200, "Test"), null]
        );
        jest.spyOn(fileDataSourceService, "readFile").mockReturnValue([Buffer.from("file"), null]);
        //when
        const result = await service.addFileDataSource(dataSource);
        expect(result).toEqual({"body": {"message": "Success"}, "code": 200});
        //then
        expect(fileDataSourceRepository.addDataSource).toBeCalled();
    });
    it('Should return error with appropriate message when datasource already exists', async () => {
        //given
        let dataSource: FileDataSource = {
            "filename": "file.txt",
            "file": Buffer.from("File Content"),
            "path": "valid/path/",
            "tag1": "tag",
            "tag2": "tag"
        }
        jest.spyOn(solrService, "postToSolr").mockImplementationOnce(async () => {
            return [statusMessage(200, "Success"), null];
        });
        jest.spyOn(fileDataSourceRepository, "addDataSource").mockImplementationOnce(() => {
            return [null, {
                "code": 400,
                "message": "File datasource already exists"
            }]
        });
        jest.spyOn(fileDataSourceService, "validateDataSource").mockReturnValue(
            [statusMessage(200, "Test"), null]
        );
        jest.spyOn(fileDataSourceService, "readFile").mockReturnValue([Buffer.from("file"), null]);
        //when
        const result = await service.addFileDataSource(dataSource);
        //then
        expect(result).toEqual({
            "code": 400,
            "body": {
                "message": "File datasource already exists"
            }
        });
    });
});
describe('FileDataSourceService : removeFileDataSource function', () => {
    it("Should return results returned by repository upon successful deletion of datasource", async () => {
        //given
        const message: string = "Successfully deleted File datasource";
        jest.spyOn(fileDataSourceRepository, "deleteDataSource").mockImplementationOnce(() => {
            return [{
                "code": 204,
                "message": message
            }, null]
        });
        const id: string = "testUUID";
        //when
        const result = await fileDataSourceService.removeFileDataSource(id);
        //then
        expect(fileDataSourceRepository.deleteDataSource).toBeCalledWith(id);
        expect(result.code).toEqual(204);
        expect(result.body.message).toEqual(message);
    });
    it("Should return appropriate error if error occurred inside repository while deleting", async () => {
        //given
        const errorCode: number = 42;
        const errorMessage: string = "some error";
        jest.spyOn(fileDataSourceRepository, "deleteDataSource").mockImplementationOnce(() => {
            return [null, {
                "code": errorCode,
                "message": errorMessage
            }]
        });
        const id: string = "testUUID";
        //when
        const result = await fileDataSourceService.removeFileDataSource(id);
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
                "lastModified": new Date(),
                "tag1": "random tag1",
                "tag2": "random tag2"
            },
            {
                "uuid": "testUUID2",
                "filename": "file2.txt",
                "path": "some/other/path/",
                "lastModified": new Date(),
                "tag1": "random tag1",
                "tag2": "random tag2"
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
            "message": "some unknown error"
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
            "lastModified": new Date(),
            "tag1": "random tag1",
            "tag2": "random tag2"
        };
        jest.spyOn(fileDataSourceRepository, "getDataSource").mockReturnValue([response, null]);
        const id: string = "testUUID1";
        //when
        const result = fileDataSourceService.getFileDataSource(id);
        //then
        expect(fileDataSourceRepository.getDataSource).toBeCalledWith(id);
        expect(result.code).toEqual(200);
        expect(result.body).toEqual(response)
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
        // @ts-ignore
        expect(result.body.message).toEqual(errorMessage);
    });
});
