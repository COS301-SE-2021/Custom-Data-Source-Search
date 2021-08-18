import express, {Request, Response} from "express";
import webPageDataSourceService from "../services/WebPageDataSource.service";

export const webPageDataSourceRouter = express.Router();

/**
 * Return all folder Data Sources
 */
// webPageDataSourceRouter.get("/", (req: Request, res: Response) => {
//     const result = webPageDataSourceService.getAllWebPageDataSources();
//     res.status(result.code).send(result.body);
// });

/**
 * Return a single webpage Data Source specified by the id
 */
// webPageDataSourceRouter.get("/:id", (req: Request, res: Response) => {
//     const result = webPageDataSourceService.getWebPageDataSource(req.params.id);
//     res.status(result.code).send(result.body);
// });

/**
 * Add a data source by it's url
 */
webPageDataSourceRouter.post("/", async (req: Request, res: Response) => {
    console.log(Buffer.from("what is this"))
    const [, err] = await webPageDataSourceService.addWebPageDataSource(req.body);
    if (err) {
        res.status(err.code).send({'message': err.message});
    } else {
        res.status(200).send({'message':'Successfully added file datasource'});
    }
});

/**
 * Remove a data source by it's id
 */
// webPageDataSourceRouter.delete("/", (req: Request, res: Response) => {
//     const result = webPageDataSourceService.removeWebPageDataSource(req.body.id);
//     res.status(result.code).send(result.body);
// });