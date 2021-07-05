/**
 * Require External Modules
 */

import express, {Request, Response} from "express"
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { textDataSourceRouter } from  "./routers/TextDataSource.router";
import {webPageDataSourceRouter} from "./routers/WebPageDataSource.router";
import {generalRouter} from "./routers/General.router";
import {folderDataSourceRouter} from "./routers/FolderDataSource.router";
import hljs from "highlight.js";


dotenv.config({path: __dirname + `/../../../.env`});
console.log(__dirname);



/**
 * App Variables
 */

if (!process.env.PORT) {
    console.log("Can't find .env");
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();


/**
 * App Configuration
 */

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/textdatasources", textDataSourceRouter);
app.use("/general", generalRouter);
app.use("/webpagedatasources", webPageDataSourceRouter)
app.use("/folderdatasources", folderDataSourceRouter);



app.listen(PORT , () => {
    console.log(`Listening on port ${PORT}`);
})

app.get("/search", (req: Request, res: Response) => {
    const result = {
        "code":200,
        "body":{
            "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24px\" viewBox=\"0 0 24 24\" width=\"24px\" fill=\"#3498db\"><path d=\"M0 0h24v24H0V0z\" fill=\"none\"/><path d=\"M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z\"/></svg>",
            "name": "Gerhard",
            "content": "<pre>" + hljs.highlightAuto(`
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
            `).value + "</pre>",
            "source": "the moon"
        }
    };
    res.status(result.code).send(result.body);
});
