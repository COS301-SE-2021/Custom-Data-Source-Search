import textDataSourceRepository from "../repositories/TextDataSourceRepository";
import folderDataSourceRepository from "../repositories/FolderDataSourceRepository";

class FolderDataSourceService {

    getAllFolderDataSources() {
        let [result, err] = folderDataSourceRepository.getAllDataSources();
        if (err) {
            return {
                "code": 500,
                "body": {
                    "message": "Internal error"
                }
            }
        }
        return {
            "code": 200,
            "body": result
        };
    }

    getFolderDataSource(id: string) {
        let [result, err] = folderDataSourceRepository.getDataSource(id);
        if (err) {
            return {
                "code": err.code,
                "body": {
                    "message": err.message
                }
            }
        }
        return {
            "code": 200,
            "body": {
                "message": "Success",
                "data": result
            }
        }
    }

    addFolderDataSource(path: string) {
        return {
            "code": 501,
            "body": "Not implemented"
        }
    }

    removeFolderDataSource(id: string) {
        return {
            "code": 501,
            "body": "Not implemented"
        }
    }
}

const folderDataSourceService = new FolderDataSourceService();
export default folderDataSourceService;