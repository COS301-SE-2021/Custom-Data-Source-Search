import folderDataSourceService from "../services/FolderDataSource.service";
import folderDataSourceRepository from "../repositories/FolderDataSourceRepository";
import {FolderDataSource, StoredFolderDataSource} from "../models/FolderDataSource.interface";
import fileDataSourceRepository from "../repositories/FileDataSourceRepository";
import fs from "fs";
import fileDataSourceService from "../services/FileDataSource.service";

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
describe("Folder data source service: getFolderDataSource function", () => {
    it("Should return a success response and the same object in the body that was returned by repository if no error occurred", () => {
        //given
        const object: StoredFolderDataSource = {
            "uuid": "testUUID",
            "path": "testPath/"
        };
        jest.spyOn(folderDataSourceRepository, "getDataSource").mockImplementation(() => {
            return [object, null];
        });
        //when
        let result = service.getFolderDataSource("testUUID");
        //then
        expect(result).not.toEqual({});
        expect(result.code).toEqual(200);
        expect(result.body.message).toEqual("Success");
        expect(result.body.data).toEqual(object);
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
        let result = service.getFolderDataSource("testUUID");
        //then
        expect(result).not.toEqual({});
        expect(result.code).toEqual(404);
        expect(result.body.message).toEqual("Folder datasource not found");
        expect(result.body.hasOwnProperty("data")).toEqual(false);
    });
});
describe("Folder data source service: addFolderDataSource function", () => {
    it("Should call repository with same path if it ends in /", () => {
        //given
        jest.spyOn(folderDataSourceRepository, "addDataSource").mockImplementation(() => {
            return [null, null];
        });
        const path: string = "test/path/";
        const dataSource: FolderDataSource = {
            path: path,
            tag1: "random tag",
            tag2: "radom tag2"
        };
        //when
        folderDataSourceService.addFolderDataSource(dataSource);
        //then
        expect(folderDataSourceRepository.addDataSource).toBeCalledWith(dataSource);
    });
    it("Should call repository with path that has / appended to the end if the path did not end in /", () => {
        //given
        jest.spyOn(folderDataSourceRepository, "addDataSource").mockImplementation(() => {
            return [null, null];
        });
        const path: string = "test/path";
        const dataSource: FolderDataSource = {
            path: path + "/",
            tag1: "random tag",
            tag2: "radom tag2"
        };
        //when
        folderDataSourceService.addFolderDataSource(dataSource);
        //then
        expect(folderDataSourceRepository.addDataSource).toBeCalledWith(dataSource);
    });
    it("Should return \"Folder datasource already exists\" error when data source already exists in the repository", () => {
        //given
        jest.spyOn(folderDataSourceRepository, "addDataSource").mockImplementation(() => {
            return [null, {
                "code": 400,
                "message": "Folder datasource already exists"
            }];
        });
        const dataSource: FolderDataSource = {
            path: "test/path/",
            tag1: "",
            tag2: ""
        }
        //when
        const result = folderDataSourceService.addFolderDataSource(dataSource);
        //then
        expect(result.code).toEqual(400);
        expect(result.body.message).toEqual("Folder datasource already exists");
    });
    it("Should return \"Directory does not exist\" error when data source already exists in the repository", () => {
        //given
        jest.spyOn(folderDataSourceRepository, "addDataSource").mockImplementation(() => {
            return [null, {
                "code": 404,
                "message": "Directory does not exist"
            }];
        });
        const dataSource: FolderDataSource = {
            path: "test/path/",
            tag1: "",
            tag2: ""
        }
        //when
        const result = folderDataSourceService.addFolderDataSource(dataSource);
        //then
        expect(result.code).toEqual(404);
        expect(result.body.message).toEqual("Directory does not exist");
    });
    it("Should return \"Successfully added datasource\" when data source was successfully added to repository", () => {
        //given
        jest.spyOn(folderDataSourceRepository, "addDataSource").mockImplementation(() => {
            return [{
                "code": 200,
                "message": "Successfully added folder datasource"
            }, null];
        });
        const dataSource: FolderDataSource = {
            path: "test/path/",
            tag1: "",
            tag2: ""
        }
        //when
        const result = folderDataSourceService.addFolderDataSource(dataSource);
        //then
        expect(result.code).toEqual(200);
        expect(result.body.message).toEqual("Successfully added datasource");
    });
});
describe("Folder data source service: removeFolderDataSource function", () => {
    it("Should return success code and message when removing from repository was successful", () => {
        //given
        jest.spyOn(folderDataSourceRepository, "deleteDataSource").mockImplementation(() => {
            return [{
                "code": 204,
                "message": "Successfully deleted folder datasource"
            }, null];
        });
        const id: string = "someTestUUID";
        //when
        const result = service.removeFolderDataSource(id);
        //then
        expect(result.code).toEqual(204);
        expect(result.body.message).toEqual("Successfully deleted folder datasource");
    });
    it("Should return \"Folder datasource not found\" error when repository does not contain datasource", () => {
        //given
        jest.spyOn(folderDataSourceRepository, "deleteDataSource").mockImplementation(() => {
            return [null, {
                "code": 404,
                "message": "Folder datasource not found"
            }];
        });
        const id: string = "someTestUUID";
        //when
        const result = service.removeFolderDataSource(id);
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
                    "lastModified": new Date("2021/03/07 12:13:46")
                },
                {
                    "uuid": "someTestUUID2",
                    "path": "some/test/path/",
                    "filename": "testFile2.txt",
                    "lastModified": new Date("2011/01/08 11:13:46")
                }
            ], null];
        });
        const path: string = "testPath/";
        //when
        const results = service.getFilesInFolder(path)
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
                    "lastModified": new Date("2021/03/07 12:13:46")
                },
                {
                    "uuid": "someTestUUID2",
                    "path": "some/test/path/",
                    "filename": "testFile2.txt",
                    "lastModified": new Date("2011/01/08 11:13:46")
                }
            ], null];
        });
        const path: string = "testPath/";
        //when
        const results = service.getFilesInFolder(path)
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
                    "lastModified": new Date("2021/03/07 12:13:46")
                },
                {
                    "uuid": "someTestUUID2",
                    "path": "some/test/path/",
                    "filename": "testFile2.txt",
                    "lastModified": new Date("2011/01/08 11:13:46")
                }
            ], null];
        });
        const path: string = "testPath/";
        //when
        const results = service.getFilesInFolder(path)
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
                    "lastModified": new Date("2021/03/07 12:13:46")
                },
                {
                    "uuid": "someTestUUID2",
                    "path": "some/test/path/",
                    "filename": "testFile2.txt",
                    "lastModified": new Date("2011/01/08 11:13:46")
                }
            ], null];
        });
        const path: string = "testPath/";
        //when
        const results = service.getFilesInFolder(path)
        //then
        expect(results).toEqual(["fileThatShouldBeInResults.txt"]);
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
        const results = service.getFilesInFolder(path)
        //then
        expect(results).toEqual([
            "testFile1.txt",
            "testFile2.txt",
        ]);
    });
});
describe("Folder data source service: searchAllFolderDataSources function", () => {
    it("Should return occurrences of searchString that was found in all of the folder data sources", async () => {
        //given
        jest.spyOn(folderDataSourceRepository, "getAllDataSources").mockImplementation(() => {
            return [[
                {
                    "uuid": "testUUID",
                    "path": "test/path/"
                },
                {
                    "uuid": "testUUID2",
                    "path": "second/test/path/"
                }
            ], null];
        });
        jest.spyOn(folderDataSourceService, "getFilesInFolder")
            .mockReturnValueOnce(["file1.txt", "file2.js"])
            .mockReturnValueOnce(["otherFile1.txt", "otherFile2.js"]);

        jest.spyOn(fileDataSourceService, "readFile")
            .mockReturnValueOnce(new Promise(resolve => {
                resolve("File contents of first file searched");
            }))
            .mockReturnValueOnce(new Promise(resolve => {
                resolve("File contents of second file searched");
            }))
            .mockReturnValueOnce(new Promise(resolve => {
                resolve("File contents of third file searched");
            }))
            .mockReturnValueOnce(new Promise(resolve => {
                resolve("File contents of fourth file searched");
            }));

        jest.spyOn(fileDataSourceService, "searchFile")
            .mockReturnValueOnce([
                {
                    "lineNumber": 1,
                    "snippet": "first file searched"
                }
            ])
            .mockReturnValueOnce([
                {
                    "lineNumber": 1,
                    "snippet": "second file searched"
                }
            ])
            .mockReturnValueOnce([
                {
                    "lineNumber": 1,
                    "snippet": "third file searched"
                }
            ])
            .mockReturnValueOnce([
                {
                    "lineNumber": 1,
                    "snippet": "fourth file searched"
                }
            ]);
        //when
        const [result,] = await service.searchAllFolderDataSources("file");
        //then
        expect(folderDataSourceService.getFilesInFolder).toBeCalledWith("test/path/");
        expect(folderDataSourceService.getFilesInFolder).toBeCalledWith("second/test/path/");

        expect(fileDataSourceService.readFile).toBeCalledWith("test/path/file1.txt");
        expect(fileDataSourceService.readFile).toBeCalledWith("test/path/file2.js");
        expect(fileDataSourceService.readFile).toBeCalledWith("second/test/path/otherFile1.txt");
        expect(fileDataSourceService.readFile).toBeCalledWith("second/test/path/otherFile2.js");

        expect(fileDataSourceService.searchFile).toBeCalledWith("File contents of first file searched", "file");
        expect(fileDataSourceService.searchFile).toBeCalledWith("File contents of second file searched", "file");
        expect(fileDataSourceService.searchFile).toBeCalledWith("File contents of third file searched", "file");
        expect(fileDataSourceService.searchFile).toBeCalledWith("File contents of fourth file searched", "file");

        expect(result).toEqual([
            {
                "type": "folder",
                "source": "test/path/file1.txt",
                "match_snippets": [
                    {
                        "lineNumber": 1,
                        "snippet": "first file searched"
                    }
                ]
            },
            {
                "type": "folder",
                "source": "test/path/file2.js",
                "match_snippets": [
                    {
                        "lineNumber": 1,
                        "snippet": "second file searched"
                    }
                ]
            },
            {
                "type": "folder",
                "source": "second/test/path/otherFile1.txt",
                "match_snippets": [
                    {
                        "lineNumber": 1,
                        "snippet": "third file searched"
                    }
                ]
            },
            {
                "type": "folder",
                "source": "second/test/path/otherFile2.js",
                "match_snippets": [
                    {
                        "lineNumber": 1,
                        "snippet": "fourth file searched"
                    }
                ]
            }
        ]);
    });
    it("Should not break when trying to search files that are not accessible", async () => {
        //given
        jest.spyOn(folderDataSourceRepository, "getAllDataSources").mockImplementation(() => {
            return [[
                {
                    "uuid": "testUUID",
                    "path": "test/path/"
                }
            ], null];
        });
        jest.spyOn(folderDataSourceService, "getFilesInFolder")
            .mockReturnValueOnce(["file1.txt", "file2.js"]);

        jest.spyOn(fileDataSourceService, "readFile")
            .mockReturnValue(new Promise((resolve, reject) => {
                reject("Promise is rejected");
            }));

        jest.spyOn(fileDataSourceService, "searchFile")
            .mockReturnValue([]);
        //when
        const [result,] = await service.searchAllFolderDataSources("file");
        //then
        expect(fileDataSourceService.searchFile).toBeCalledWith("", "file");
        expect(fileDataSourceService.searchFile).toBeCalledWith("", "file");
        expect(result).toEqual([]);
    });
});