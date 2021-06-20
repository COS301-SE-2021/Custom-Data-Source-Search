import express, {Request, Response} from "express";

export const webPageDataSourceRouter = express.Router();

webPageDataSourceRouter.get("/", (req: Request, res: Response) => {
    try {
        //const textDataSources: TextDataSourceList = textDataSourceService.getAllTextDataSources();
        //const webPageDataSources: WebPageDataSourceList = webPageDataSourceService.getAllWebPageDataSources();
      //  res.status(200).send(textDataSources)
    } catch (e) {
        res.status(500).send(e.message);
    }

});