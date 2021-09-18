import express from "express"
import * as dotenv from "dotenv";
import helmet from "helmet";
import { fileDataSourceRouter } from "./routers/FileDataSource.router";
import {webPageDataSourceRouter} from "./routers/WebPageDataSource.router";
import {generalRouter} from "./routers/General.router";
import {folderDataSourceRouter} from "./routers/FolderDataSource.router";
import {userRouter} from "./routers/User.router";
import {generateUUID} from "./general/generalFunctions";
import fileDataSourceService from "./services/FileDataSource.service";
import fs from "fs";
import {gitHubDataSourceRouter} from "./routers/GitHubDataSource.router";
const cors = require('cors');

try {
    fs.readFileSync(__dirname + `/../../../.env`);
    dotenv.config({path: __dirname + `/../../../.env`});
    console.log(__dirname);
} catch (e) {}


if (!process.env.PORT) {
    console.log("Can't find .env");
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();
app.use(cors({origin: 'http://localhost:8080'}))
app.use(helmet());
app.use(express.json());
app.use("/general", generalRouter);
app.use("/users", userRouter);
app.use("/filedatasources", fileDataSourceRouter);
app.use("/webpagedatasources", webPageDataSourceRouter);
app.use("/folderdatasources", folderDataSourceRouter);
app.use("/githubdatasources", gitHubDataSourceRouter);

const server = app.listen(PORT , () => {
    console.log("Server Started");
    console.log(`Listening on port ${PORT}`);
});

setTimeout(() => {
    setInterval(async () => {
        try {
            await fileDataSourceService.updateDatasources();
        } catch (e) {
            console.log("Error encountered.");
        }
    }, 10000);
    process.env.JWT_SECRET_KEY = generateUUID();
    setInterval(async () => {
        process.env.JWT_SECRET_KEY = generateUUID();
    }, 60000 * 5);
}, 500);

export default server;