import express, {Request, Response} from "express";
import webPageDataSourceService from "../services/WebPageDataSource.service";

export const webPageDataSourceRouter = express.Router();

webPageDataSourceRouter.get("/", (req: Request, res: Response) => {
    const result = webPageDataSourceService.getAllWebPageDataSources();
    res.status(result.code).send(result.body);
});

webPageDataSourceRouter.get("/:id", (req: Request, res: Response) => {
    const result = webPageDataSourceService.getWebPageDataSource(req.params.id);
    res.status(result.code).send(result.body);
});

webPageDataSourceRouter.post("/", async (req: Request, res: Response) => {
    const [, err] = await webPageDataSourceService.addWebPageDataSource(req.body);
    if (err) {
        res.status(err.code).send({'message': err.message});
    } else {
        res.status(200).send({'message':'Successfully added file datasource'});
    }
});

webPageDataSourceRouter.delete("/", (req: Request, res: Response) => {
    const result = webPageDataSourceService.removeWebPageDataSource(req.body.id);
    res.status(result.code).send(result.body);
});