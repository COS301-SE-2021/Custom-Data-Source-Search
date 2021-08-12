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
    const error = await webPageDataSourceService.addWebPageDataSource(req.body.url);
    if (error == null) {
        res.status(200).send({'message': 'Successfully added webpage datasource'});
    } else {
        res.status(error.status).send(error.message)
    }

});

webPageDataSourceRouter.delete("/", (req: Request, res: Response) => {
    try {
        webPageDataSourceService.removeWebPageDataSource(req.body.id);
        res.status(204).send('Successfully removed webpage datasource');
    } catch (e) {
        if (e.status) {
            res.status(e.status).send(e.message);
        } else {
            res.status(500).send(e.message);
        }
    }
});