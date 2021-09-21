import express from "express";
import jwt from "jsonwebtoken";
import fs from "fs";
import * as dotenv from "dotenv";
import {folderDataSourceRouter} from "../../routers/FolderDataSource.router";
import {StoredFolderDataSource} from "../../models/FolderDataSource.interface";
import folderDataSourceRepository from "../../repositories/FolderDataSourceRepository";
const request = require("supertest");
const app = express();
app.use("/folderdatasources", folderDataSourceRouter);
try {
    fs.readFileSync(__dirname + `/../../../../../.env`);
    dotenv.config({path: __dirname + `/../../../../../.env`});
} catch (e) {}

describe("Testing folder datasource routes", () => {
    it("Should return all the folder datasources stored in repository", async () => {
        //given
        const folderRepositoryResult: StoredFolderDataSource[] = [
            {
                uuid: "firstUUID",
                path: "pathOne/",
                dotIgnore: "pathToIgnore/\n*.docx",
                tag1: "firstTagOne",
                tag2: "firstTagTwo"
            },
            {
                uuid: "secondUUID",
                path: "pathTwo/",
                dotIgnore: "pathToIgnore/\n*.docx",
                tag1: "secondTagOne",
                tag2: "secondTagTwo"
            }
        ]
        const folderUser: any = {
            first_name: "Bob",
            last_name: "Builder",
            email: "bob@builder.com",
            uuid: "fakeUserUUID",
            role: "viewer"
        };
        jest.spyOn(folderDataSourceRepository, "getAllDataSources")
            .mockReturnValueOnce([folderRepositoryResult, null]);
        const secret: string = process.env.JWT_SECRET_KEY;
        const token = jwt.sign(folderUser, secret);
        //when
        const { body } = await request(app)
            .get("/folderdatasources")
            .set('Authorization', 'Bearer ' + token);
        //then
        expect(body).toEqual(folderRepositoryResult);
    });
});