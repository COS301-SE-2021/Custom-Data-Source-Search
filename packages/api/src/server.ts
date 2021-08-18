/**
 * Require External Modules
 */
import express from "express"
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { fileDataSourceRouter } from "./routers/FileDataSource.router";
import {webPageDataSourceRouter} from "./routers/WebPageDataSource.router";
import {generalRouter} from "./routers/General.router";
import {folderDataSourceRouter} from "./routers/FolderDataSource.router";
import fileDataSourceRepository from "./repositories/FileDataSourceRepository";
import {userRouter} from "./routers/User.router";
import {randomBytes} from "crypto";

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
app.use("/filedatasources", fileDataSourceRouter);
app.use("/general", generalRouter);
app.use("/webpagedatasources", webPageDataSourceRouter);
app.use("/folderdatasources", folderDataSourceRouter);
app.use("/users", userRouter);

app.listen(PORT , () => {
    console.log("Server Started");
    console.log(`Listening on port ${PORT}`);
});

setTimeout(() => {
    setInterval(async () => {
        try {
            await fileDataSourceRepository.updateDatasources();
        } catch (e) {
            console.log("Error encountered.");
        }
    }, 10000);
}, 500);

setTimeout(() => {
    process.env.JWT_SECRET_KEY = randomBytes(16).toString("hex");
    setInterval(async () => {
        process.env.JWT_SECRET_KEY = randomBytes(16).toString("hex");
    }, 60000 * 5);
}, 500);