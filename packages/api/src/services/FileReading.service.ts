import fs from 'fs';
import FileReadingError from "../errors/FileReadingError";

class FileReadingService {

    constructor() {
        console.log('File Reading Service Created');
    }

    async isFileAccessible(path: string, fileName: string) : Promise<boolean>{

        let fullPath = path + fileName

        try {
            await fs.promises.access(fullPath, fs.constants.R_OK);
        } catch (err){
            return false;
        }

        return true;
    }

    async readFile(path: string, fileName: string) : Promise<[String, Error]>{

        let fullPath = path + fileName

        var fileContents : string;

        try {
            fileContents = await fs.promises.readFile(fullPath, 'utf-8')
        } catch(err) {
            if (err.code == 'ENOENT') {
               // throw new FileReadingError('FILE NOT FOUND', 404);
                return ["", new FileReadingError('FILE NOT FOUND', 404)]
            } else if (err.code == 'EACCES') {
               // throw new FileReadingError('ACCESS FORBIDDEN', 403);
                return ["", new FileReadingError('ACCESS FORBIDDEN', 403)]
            }

        }
    return [fileContents, null];
    }


}

const fileReadingService = new FileReadingService();
export default fileReadingService;