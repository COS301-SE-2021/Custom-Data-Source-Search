import fs from "fs";

class FolderDataSourceRepository {
    folderDataSourceArray: [];

    constructor() {
        this.folderDataSourceArray = [];
    }

    addDataSource() {

    }

    getDataSource(uuid: string) {

    }

    getAllDataSources(): any {
        this.readFile()
        return [this.folderDataSourceArray, null];
    }

    updateDataSource(uuid: string) {

    }

    deleteDataSource(uuid: string) {

    }

    readFile() {
        try {
            this.folderDataSourceArray = JSON.parse(fs.readFileSync('./src/repositories/store/folderDataStore.json', 'utf-8'));
        } catch (err) {
            this.folderDataSourceArray = [];
        }
    }
}

const folderDataSourceRepository = new FolderDataSourceRepository();
export default folderDataSourceRepository;