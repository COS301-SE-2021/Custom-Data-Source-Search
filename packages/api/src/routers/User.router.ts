/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from "express";

/**
 * Router Definition
 */
export const userRouter = express.Router();

/**
 * Controller Definitions
 */

userRouter.get("/", (req: Request, res: Response) => {
    //const result = fileDataSourceService.getFileDataSource(req.params.id);
    //res.status(result.code).send(result.body);
});