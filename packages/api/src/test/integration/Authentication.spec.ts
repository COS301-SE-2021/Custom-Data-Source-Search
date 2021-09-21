import express from "express";
import {fileDataSourceRouter} from "../../routers/FileDataSource.router";
import jwt from "jsonwebtoken";
import fs from "fs";
import * as dotenv from "dotenv";
import fileDataSourceService from "../../services/FileDataSource.service";

const request = require("supertest");
const app = express();
app.use("/filedatasources", fileDataSourceRouter);
try {
    fs.readFileSync(__dirname + `/../../../../../.env`);
    dotenv.config({path: __dirname + `/../../../../../.env`});
} catch (e) {}

describe("Testing endpoints for authentication and authorization", () => {
    const user: any = {
        first_name: "Bob",
        last_name: "Builder",
        email: "bob@builder.com",
        uuid: "fakeUserUUID",
        role: "viewer"
    };
    it("Should return success if user is authenticated and has sufficient permission", async () => {
        //given
        jest.spyOn(fileDataSourceService, "getAllFileDataSources")
            .mockReturnValueOnce({
                "code": 200,
                "body": []
            });
        const secret: string = process.env.JWT_SECRET_KEY;
        const token = jwt.sign(user, secret);
        //when
        const { statusCode } = await request(app)
            .get("/filedatasources")
            .set('Authorization', 'Bearer ' + token);
        //then
        expect(statusCode).toEqual(200);
    });
    it("Should return unauthorized if jwt has expired", async () => {
        //given
        const secret: string = "SomeOtherKey";
        const token = jwt.sign(user, secret);
        //when
        const { statusCode } = await request(app)
            .get("/filedatasources")
            .set('Authorization', 'Bearer ' + token);
        //then
        expect(statusCode).toEqual(403);
    });
});