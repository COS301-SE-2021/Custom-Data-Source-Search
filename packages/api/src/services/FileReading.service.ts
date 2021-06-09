import fs from 'fs';
import FileReadingError from "../errors/FileReadingError";

class FileReadingService{
    constructor() {
    }

    checkFileValid(fileName: string, filePath: string){
        if (fileName === '') {
            throw new FileReadingError('NO FILE NAME', 400);
        } else if (filePath === '') {
            throw new FileReadingError('NO FILE PATH', 400);
        }
        try {
            fs.readFileSync(filePath + fileName);
        } catch (err){
            if(err.code == 'ENOENT'){
                throw new FileReadingError('FILE NOT FOUND', 404);
            } else if(err.code == 'EACCES'){
                throw new FileReadingError('ACCESS FORBIDDEN', 403);
            }
            throw err;
        }
    }
}

const fileReadingService = new FileReadingService();
export default fileReadingService;