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
import {generateUUID} from "./general/generalFunctions";

dotenv.config({path: __dirname + `/../../../.env`});
console.log(__dirname);

if (!process.env.PORT) {
    console.log("Can't find .env");
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/filedatasources", fileDataSourceRouter);
app.use("/general", generalRouter);
app.use("/webpagedatasources", webPageDataSourceRouter);
app.use("/folderdatasources", folderDataSourceRouter);
app.use("/users", userRouter);

const server = app.listen(PORT , () => {
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
    process.env.JWT_SECRET_KEY = generateUUID();
    setInterval(async () => {
        process.env.JWT_SECRET_KEY = generateUUID();
    }, 60000 * 5);
}, 500);

export default server;