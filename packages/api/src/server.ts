/**
 * Require External Modules
 */
import express from "express"
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { textDataSourceRouter } from  "./routers/TextDataSource.router";
import {webPageDataSourceRouter} from "./routers/WebPageDataSource.router";
import {generalRouter} from "./routers/General.router";
import {folderDataSourceRouter} from "./routers/FolderDataSource.router";
import textDataSourceRepository from "./repositories/TextDataSourceRepository";

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
app.use("/webpagedatasources", webPageDataSourceRouter);
app.use("/folderdatasources", folderDataSourceRouter);

app.listen(PORT , () => {
    console.log(`Listening on port ${PORT}`);
});

setTimeout(() => {
    setInterval(async () => {
        try {
            await textDataSourceRepository.updateDatasources();
        } catch (e) {
            console.log("Error encountered.");
        }
    }, 3000);
}, 5000);
