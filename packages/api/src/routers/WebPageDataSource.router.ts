import express, {Request, Response} from "express";
import {WebPageDataSourceList} from "../models/WebPageDataSource.interface";
import webPageDataSourceService from "../services/WebPageDataSource.service";

export const webPageDataSourceRouter = express.Router();

webPageDataSourceRouter.get("/", (req: Request, res: Response) => {
    try {
        //const textDataSources: TextDataSourceList = textDataSourceService.getAllTextDataSources();
        const webPageDataSources: WebPageDataSourceList = webPageDataSourceService.getAllWebPageDataSources();
        res.status(200).send(webPageDataSources)
    } catch (e) {
        res.status(500).send(e.message);
    }

});