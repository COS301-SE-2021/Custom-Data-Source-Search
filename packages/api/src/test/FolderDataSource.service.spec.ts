import folderDataSourceService from "../services/FolderDataSource.service";
import folderDataSourceRepository from "../repositories/FolderDataSourceRepository";
import {StoredFolderDataSource} from "../models/FolderDataSource.interface";

const service = folderDataSourceService;

describe("Folder data source service: getAllFolderDataSources function", () => {
    it("Should return same object in the body that was returned by repository if no error occurred", () => {
        //given
        const object: StoredFolderDataSource[] = [{
            "uuid": "testUUID",
            "path": "testPath/"
        }];
        jest.spyOn(folderDataSourceRepository, "getAllDataSources").mockImplementation(() => {
            return [object, null];
        });
        //when
        let result = service.getAllFolderDataSources();
        //then
        expect(result).not.toEqual({});
        expect(result.code).toEqual(200);
        expect(result.body).toEqual(object);
    });
    it("Should return empty array in the body when repository is empty if no error occurred", () => {
        //given
        jest.spyOn(folderDataSourceRepository, "getAllDataSources").mockImplementation(() => {
            return [[], null];
        });
        //when
        let result = service.getAllFolderDataSources();
        //then
        expect(result).not.toEqual({});
        expect(result.code).toEqual(200);
        expect(result.body).toEqual([]);
    });
    it("Should return a 500 error with a message if an error occurred", () => {
        //given
        const error = {
            "code": 500,
            "message": "Internal error occurred"
        };
        jest.spyOn(folderDataSourceRepository, "getAllDataSources").mockImplementation(() => {
            return [null, error];
        });
        //when
        let result = service.getAllFolderDataSources();
        //then
        expect(result).not.toEqual({});
        expect(result.code).toEqual(500);
        expect(result.body.hasOwnProperty("message")).toEqual(true);
        // @ts-ignore
        expect(result.body.message).toEqual("Internal error");
    });
});
