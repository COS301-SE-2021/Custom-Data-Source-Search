import express, {Request, Response} from "express";
import gitHubDataSourceService from "../services/GitHubDataSource.service";
import {authUser} from "../authentication/authentication";

export const gitHubDataSourceRouter = express.Router();

/**
 * Return the all GitHub datasources
 */
gitHubDataSourceRouter.get("/", (req: Request, res: Response) => {
    const result = gitHubDataSourceService.getAllGitHubDataSources();
    res.status(result.code).send(result.body);
});

/**
 * Return a single GitHub datasource specified by the id
 */
gitHubDataSourceRouter.get("/:id", (req: Request, res: Response) => {
    const result = gitHubDataSourceService.getGitHubDataSource(req.params.id);
    res.status(result.code).send(result.body);
});

/**
 * Add a GitHub data source
 */
gitHubDataSourceRouter.post("/", authUser("editor"), async (req: Request, res: Response) => {
    const result = await gitHubDataSourceService.addGitHubDataSource(req.body);
    res.status(result.code).send(result.body);
});

/**
 * Remove a GitHub data source by it's id
 */
gitHubDataSourceRouter.delete("/", authUser("editor"), async (req: Request, res: Response) => {
    const result = await gitHubDataSourceService.removeGitHubDataSource(req.body.id);
    res.status(result.code).send(result.body);
});