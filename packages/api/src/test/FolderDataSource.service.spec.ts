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
});
