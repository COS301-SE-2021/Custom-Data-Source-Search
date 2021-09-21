import express from "express";
import jwt from "jsonwebtoken";
import fs from "fs";
import * as dotenv from "dotenv";
import {webPageDataSourceRouter} from "../../routers/WebPageDataSource.router";
import {StoredWebPageDataSource} from "../../models/WebPageDataSource.interface";
import webPageDataSourceRepository from "../../repositories/WebPageDataSourceRepository";

const request = require("supertest");
const app = express();
app.use("/webpagedatasources", webPageDataSourceRouter);
try {
    fs.readFileSync(__dirname + `/../../../../../.env`);
    dotenv.config({path: __dirname + `/../../../../../.env`});
} catch (e) {}

describe("Testing webpage datasource routes", () => {
    it("Should return all the webpage datasources stored in repository", async () => {
        //given
        const webpageRepositoryResult: StoredWebPageDataSource[] = [
            {
                uuid: "firstUUID",
                url: "https://someurl.com",
                tag1: "firstTagOne",
                tag2: "firstTagTwo"
            },
            {
                uuid: "secondUUID",
                url: "https://someOtherUrl.com",
                tag1: "secondTagOne",
                tag2: "secondTagTwo"
            }
        ]
        const webUser: any = {
            first_name: "Alice",
            last_name: "Cairn",
            email: "alice@gmail.com",
            uuid: "fakeUserUUID",
            role: "editor"
        };
        jest.spyOn(webPageDataSourceRepository, "getAllDataSources")
            .mockReturnValueOnce([webpageRepositoryResult, null]);
        const secret: string = process.env.JWT_SECRET_KEY;
        const token = jwt.sign(webUser, secret);
        //when
        const { body } = await request(app)
            .get("/webpagedatasources")
            .set('Authorization', 'Bearer ' + token);
        //then
        expect(body).toEqual(webpageRepositoryResult);
    });
});