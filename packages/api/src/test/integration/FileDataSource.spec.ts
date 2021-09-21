import express from "express";
import {fileDataSourceRouter} from "../../routers/FileDataSource.router";
import jwt from "jsonwebtoken";
import fs from "fs";
import * as dotenv from "dotenv";
import fileDataSourceRepository from "../../repositories/FileDataSourceRepository";
import {StoredFileDataSource} from "../../models/FileDataSource.interface";
import {castToStoredFileOverNetwork} from "../../general/generalFunctions";
const request = require("supertest");
const app = express();
app.use("/filedatasources", fileDataSourceRouter);
try {
    fs.readFileSync(__dirname + `/../../../../../.env`);
    dotenv.config({path: __dirname + `/../../../../../.env`});
} catch (e) {}
describe("Testing file datasource routes", () => {
    it("Should return all the file datasources stored in repository", async () => {
        //given
        const repositoryResult: StoredFileDataSource[] = [
            {
                uuid: "firstUUID",
                filename: "firstFileName",
                path: "pathOne/",
                lastModified: new Date(),
                tag1: "firstTagOne",
                tag2: "firstTagTwo"
            },
            {
                uuid: "secondUUID",
                filename: "secondFileName",
                path: "pathTwo/",
                lastModified: new Date(),
                tag1: "secondTagOne",
                tag2: "secondTagTwo"
            }
        ]
        const user: any = {
            first_name: "Bob",
            last_name: "Builder",
            email: "bob@builder.com",
            uuid: "fakeUserUUID",
            role: "viewer"
        };
        jest.spyOn(fileDataSourceRepository, "getAllDataSources")
            .mockReturnValueOnce([repositoryResult, null]);
        const secret: string = process.env.JWT_SECRET_KEY;
        const token = jwt.sign(user, secret);
        //when
        const { body } = await request(app)
            .get("/filedatasources")
            .set('Authorization', 'Bearer ' + token);
        //then
        expect(body).toEqual(repositoryResult.map(castToStoredFileOverNetwork));
    });
});