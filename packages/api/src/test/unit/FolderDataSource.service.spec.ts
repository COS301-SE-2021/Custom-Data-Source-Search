import folderDataSourceService from "../../services/FolderDataSource.service";
import folderDataSourceRepository from "../../repositories/FolderDataSourceRepository";
import {FolderDataSource, StoredFolderDataSource} from "../../models/FolderDataSource.interface";
import fileDataSourceRepository from "../../repositories/FileDataSourceRepository";
import fs from "fs";
import {statusMessage} from "../../general/generalFunctions";

describe("Folder data source service: getAllFolderDataSources function", () => {
    it("Should return same object in the body that was returned by repository if no error occurred", () => {
        //given
        const object: StoredFolderDataSource[] = [{
            uuid: "testUUID",
            path: "testPath/",
            tag1: "test tag",
            tag2: "other test tag",
            dotIgnore: ""
        }];
        jest.spyOn(folderDataSourceRepository, "getAllDataSources").mockImplementation(() => {
            return [object, null];
        });
        //when
        let result = folderDataSourceService.getAllFolderDataSources();
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
        let result = folderDataSourceService.getAllFolderDataSources();
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
        let result = folderDataSourceService.getAllFolderDataSources();
        //then
        expect(result).not.toEqual({});
        expect(result.code).toEqual(500);
        expect(result.body.hasOwnProperty("message")).toEqual(true);
        // @ts-ignore
        expect(result.body.message).toEqual("Internal error occurred");
    });
});
describe("Folder data source service: getFolderDataSource function", () => {
    it("Should return a success response and the same object in the body that was returned by repository if no error occurred", () => {
        //given
        const object: StoredFolderDataSource = {
            "uuid": "testUUID",
            "path": "testPath/",
            "tag1": "tag1",
            "tag2": "tag2",
            dotIgnore: "",
        };
        jest.spyOn(folderDataSourceRepository, "getDataSource").mockImplementation(() => {
            return [object, null];
        });
        //when
        let result = folderDataSourceService.getFolderDataSource("testUUID");
        //then
        expect(result).not.toEqual({});
        expect(result.code).toEqual(200);
        expect(result.body).toEqual(object);
    });
    it("Should return 404 error when datasource is not found", () => {
        //given
        const error = {
            "code": 404,
            "message": "Folder datasource not found"
        };
        jest.spyOn(folderDataSourceRepository, "getDataSource").mockImplementation(() => {
            return [null, error];
        });
        //when
        let result = folderDataSourceService.getFolderDataSource("testUUID");
        //then
        expect(result).not.toEqual({});
        expect(result.code).toEqual(404);
        // @ts-ignore
        expect(result.body.message).toEqual("Folder datasource not found");
        expect(result.body.hasOwnProperty("data")).toEqual(false);
    });
});
describe("Folder data source service: addFolderDataSource function", () => {
    it("Should call repository with same path if it ends in /", () => {
        //given
        jest.spyOn(fs, "existsSync").mockReturnValueOnce(true);
        jest.spyOn(folderDataSourceRepository, "addDataSource").mockImplementation(() => {
            return [null, null];
        });
        const path: string = "test/path/";
        const dataSource: FolderDataSource = {
            path: path,
            tag1: "random tag",
            tag2: "radom tag2",
            dotIgnore: "",
            depth: 1
        };
        //when
        folderDataSourceService.addFolderDataSource(dataSource);
        //then
        expect(folderDataSourceRepository.addDataSource).toBeCalled();
    });
    it("Should call repository with path that has / appended to the end if the path did not end in /", () => {
        //given
        jest.spyOn(fs, "existsSync").mockReturnValueOnce(true);
        jest.spyOn(folderDataSourceRepository, "addDataSource").mockImplementation(() => {
            return [null, null];
        });
        const path: string = "test/path";
        const dataSource: FolderDataSource = {
            path: path + "/",
            tag1: "random tag",
            tag2: "radom tag2",
            dotIgnore: "",
            depth: 1
        };
        //when
        folderDataSourceService.addFolderDataSource(dataSource);
        //then
        expect(folderDataSourceRepository.addDataSource).toBeCalled();
    });
    it("Should return \"Folder datasource already exists\" error when data source already exists in the repository", async () => {
        //given
        jest.spyOn(fs, "existsSync").mockReturnValueOnce(true);
        jest.spyOn(folderDataSourceRepository, "addDataSource").mockImplementation(() => {
            return [null, {
                "code": 400,
                "message": "Folder datasource already exists"
            }];
        });
        const dataSource: FolderDataSource = {
            path: "test/path/",
            tag1: "",
            tag2: "",
            dotIgnore: "",
            depth: 1
        }
        //when
        const result = await folderDataSourceService.addFolderDataSource(dataSource);
        //then
        expect(result.code).toEqual(400);
        expect(result.body.message).toEqual("Folder datasource already exists");
    });
    it("Should return \"Directory does not exist\" error when data source already exists in the repository", async () => {
        //given
        jest.spyOn(folderDataSourceRepository, "addDataSource").mockImplementation(() => {
            return [null, {
                "code": 404,
                "message": "Directory does not exist"
            }];
        });
        jest.spyOn(folderDataSourceRepository, "addFileInFolder").mockImplementation(() => {
            return [statusMessage(200, "Test"), null];
        });
        const dataSource: FolderDataSource = {
            path: "test/path/",
            tag1: "",
            tag2: "",
            dotIgnore: "",
            depth: 1
        }
        //when
        const result = await folderDataSourceService.addFolderDataSource(dataSource);
        //then
        expect(result.code).toEqual(404);
        expect(result.body.message).toEqual("Directory does not exist");
    });
    it("Should return \"Successfully added datasource\" when data source was successfully added to repository", async () => {
        //given
        jest.spyOn(fs, "existsSync").mockReturnValueOnce(true);
        jest.spyOn(folderDataSourceRepository, "addDataSource").mockImplementation(() => {
            return [{
                "code": 200,
                "message": "Successfully added file datasource",
                "uuid": "uuidstring"
            }, null];
        });
        jest.spyOn(folderDataSourceService, "getFilesInFolder").mockReturnValueOnce([]);
        jest.spyOn(folderDataSourceRepository, "addFileInFolder").mockImplementation(() => {
            return [statusMessage(200, "Test"), null];
        });
        const dataSource: FolderDataSource = {
            path: "test/path/",
            tag1: "",
            tag2: "",
            dotIgnore: "",
            depth: 1
        }
        //when
        const result = await folderDataSourceService.addFolderDataSource(dataSource);
        //then
        expect(result.code).toEqual(200);
        expect(result.body.message).toEqual("Successfully added datasource");
    });
});
describe("Folder data source service: removeFolderDataSource function", () => {
    it("Should return success code and message when removing from repository was successful", async () => {
        //given
        jest.spyOn(folderDataSourceRepository, "deleteDataSource").mockImplementation(() => {
            return [{
                "code": 204,
                "message": "Successfully deleted folder datasource"
            }, null];
        });
        const id: string = "someTestUUID";
        //when
        const result = await folderDataSourceService.removeFolderDataSource(id);
        //then
        expect(result.code).toEqual(204);
        expect(result.body.message).toEqual("Successfully deleted folder datasource");
    });
    it("Should return \"Folder datasource not found\" error when repository does not contain datasource", async() => {
        //given
        jest.spyOn(folderDataSourceRepository, "deleteDataSource").mockImplementation(() => {
            return [null, {
                "code": 404,
                "message": "Folder datasource not found"
            }];
        });
        const id: string = "someTestUUID";
        //when
        const result = await folderDataSourceService.removeFolderDataSource(id);
        //then
        expect(result.code).toEqual(404);
        expect(result.body.message).toEqual("Folder datasource not found");
    });
});
describe("Folder data source service: getFilesInFolder function", () => {
    it("Should return no file paths if the files exist in file datasource repository", () => {
        //given
        // @ts-ignore
        jest.spyOn(fs, "readdirSync").mockImplementation(() => {
            return [
                "testFile1.txt",
                "testFile2.txt"
            ];
        });
        jest.spyOn(fileDataSourceRepository, "getAllDataSources").mockImplementation(() => {
            return [[
                {
                    "uuid": "someTestUUID",
                    "path": "some/test/path/",
                    "filename": "testFile1.txt",
                    "lastModified": new Date("2021/03/07 12:13:46"),
                    "tag1": "test",
                    "tag2": "other tag"
                },
                {
                    "uuid": "someTestUUID2",
                    "path": "some/test/path/",
                    "filename": "testFile2.txt",
                    "lastModified": new Date("2011/01/08 11:13:46"),
                    "tag1": "test",
                    "tag2": "other tag"
                }
            ], null];
        });
        const path: string = "some/test/path/";
        //when
        const results = folderDataSourceService.getFilesInFolder(path, "", 1);
        //then
        expect(results).toEqual([]);
    });
    it("Should return no file paths if the folder contains no files", () => {
        //given
        jest.spyOn(fs, "readdirSync").mockImplementation(() => {
            return [];
        });
        jest.spyOn(fileDataSourceRepository, "getAllDataSources").mockImplementation(() => {
            return [[
                {
                    "uuid": "someTestUUID",
                    "path": "some/test/path/",
                    "filename": "testFile1.txt",
                    "lastModified": new Date("2021/03/07 12:13:46"),
                    "tag1": "test1",
                    "tag2": "other tag"
                },
                {
                    "uuid": "someTestUUID2",
                    "path": "some/test/path/",
                    "filename": "testFile2.txt",
                    "lastModified": new Date("2011/01/08 11:13:46"),
                    "tag1": "test",
                    "tag2": "other tag"
                }
            ], null];
        });
        const path: string = "testPath/";
        //when
        const results = folderDataSourceService.getFilesInFolder(path, "", 1);
        //then
        expect(results).toEqual([]);
    });
    it("Should return no file paths if the folder contains only sub folders", () => {
        //given
        // @ts-ignore
        jest.spyOn(fs, "readdirSync").mockImplementation(() => {
            return [
                "some/path/to/a/directory/",
                "another/path/to/directory/"
            ];
        });
        jest.spyOn(fileDataSourceRepository, "getAllDataSources").mockImplementation(() => {
            return [[
                {
                    "uuid": "someTestUUID",
                    "path": "some/test/path/",
                    "filename": "testFile1.txt",
                    "lastModified": new Date("2021/03/07 12:13:46"),
                    "tag1": "tag one",
                    "tag2": "other tag"
                },
                {
                    "uuid": "someTestUUID2",
                    "path": "some/test/path/",
                    "filename": "testFile2.txt",
                    "lastModified": new Date("2011/01/08 11:13:46"),
                    "tag1": "test",
                    "tag2": "other tag"
                }
            ], null];
        });
        const path: string = "testPath/";
        //when
        const results = folderDataSourceService.getFilesInFolder(path, "", 1);
        //then
        expect(results).toEqual([]);
    });
    it("Should return only file paths that are not also in file datasource repository", () => {
        //given
        // @ts-ignore
        jest.spyOn(fs, "readdirSync").mockImplementation(() => {
            return [
                "testFile1.txt",
                "fileThatShouldBeInResults.txt"
            ];
        });
        jest.spyOn(fileDataSourceRepository, "getAllDataSources").mockImplementation(() => {
            return [[
                {
                    "uuid": "someTestUUID",
                    "path": "some/test/path/",
                    "filename": "testFile1.txt",
                    "lastModified": new Date("2021/03/07 12:13:46"),
                    "tag1": "this is tag",
                    "tag2": "other tag"
                },
                {
                    "uuid": "someTestUUID2",
                    "path": "some/test/path/",
                    "filename": "testFile2.txt",
                    "lastModified": new Date("2011/01/08 11:13:46"),
                    "tag1": "test",
                    "tag2": "other tag"
                }
            ], null];
        });
        const path: string = "some/test/path/";
        //when
        const results = folderDataSourceService.getFilesInFolder(path, "", 1);
        //then
        expect(results).toEqual(["some/test/path/fileThatShouldBeInResults.txt"]);
    });
    it("Should return all files in folder if they are not in file datasource repository", () => {
        //given
        // @ts-ignore
        jest.spyOn(fs, "readdirSync").mockImplementation(() => {
            return [
                "testFile1.txt",
                "testFile2.txt",
            ];
        });
        jest.spyOn(fileDataSourceRepository, "getAllDataSources").mockImplementation(() => {
            return [[], null];
        });
        const path: string = "testPath/";
        //when
        const results = folderDataSourceService.getFilesInFolder(path, "", 1);
        //then
        expect(results).toEqual([
            "testPath/testFile1.txt",
            "testPath/testFile2.txt",
        ]);
    });
});