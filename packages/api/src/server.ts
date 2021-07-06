/**
 * Require External Modules
 */

import express, {Request, Response} from "express"
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import {textDataSourceRouter} from "./routers/TextDataSource.router";
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


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

app.get("/search", (req: Request, res: Response) => {
    const result = {
        "code": 200,
        "body": [
            {
                "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24px\" viewBox=\"0 0 24 24\" width=\"24px\" fill=\"#2ecc71\"><path d=\"M0 0h24v24H0V0z\" fill=\"none\"/><path d=\"M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z\"/></svg>",
                "name": "FileReadingService.ts",
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
                "source": "C:/users/default/data_sleuth/api/src"
            },
            {
                "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24px\" viewBox=\"0 0 24 24\" width=\"24px\" fill=\"#2ecc71\"><path d=\"M0 0h24v24H0V0z\" fill=\"none\"/><path d=\"M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z\"/></svg>",
                "name": "App.vue",
                "content": "<pre>" + hljs.highlightAuto(`
<template>
  <div class="grid-app">
    <div id="nav">
      <router-link title="Search" class="icon" to="/"><icon-search/></router-link>
      <router-link title="Data Sources" class="icon" to="/datasources"><icon-storage/></router-link>
    </div>
    <div>
    <router-view/>
    </div>
  </div>
</template>
            `).value + "</pre>",
                "source": "C:/users/default/data_sleuth/client/src"
            }
        ]
    };
    res.status(result.code).send(result.body);
});
