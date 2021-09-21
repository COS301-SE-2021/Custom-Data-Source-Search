import express from "express";
import {fileDataSourceRouter} from "../../routers/FileDataSource.router";
import jwt from "jsonwebtoken";
import fs from "fs";
import * as dotenv from "dotenv";
import fileDataSourceService from "../../services/FileDataSource.service";
import userRepository from "../../repositories/UserRepository";
import {userRouter} from "../../routers/User.router";
import bodyParser from "body-parser";

const request = require("supertest");
const app = express();
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use("/users", userRouter);
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
    const adminUser = {
        first_name: "Jeff",
        last_name: "Haggarty",
        email: "j@h.com",
        uuid: "jeffFakeUserUUID",
        role: "admin"
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
        expect(statusCode).toEqual(401);
    });
    it("Should return not allowed if user role is not sufficient", async () => {
        //given
        const secret: string = process.env.JWT_SECRET_KEY;
        const token = jwt.sign(user, secret);
        //when
        const { statusCode } = await request(app)
            .post("/filedatasources")
            .set('Authorization', 'Bearer ' + token);
        //then
        expect(statusCode).toEqual(403);
    });
    it("Should return not allowed if user tries to add another user with a higher role", async () => {
        //given
        const requestObj = {
            users: [
                {
                    first_name: "John",
                    last_name: "Smith",
                    email: "smith@me.com",
                    role: "super"
                }
            ]
        };
        const secret: string = process.env.JWT_SECRET_KEY;
        const token = jwt.sign(adminUser, secret);
        //when
        const { statusCode } = await request(app)
            .post("/users")
            .set('Authorization', 'Bearer ' + token)
            .send(requestObj);
        //then
        expect(statusCode).toEqual(403);
    });
    it("Should return not allowed if user tries to delete another user with a higher role", async () => {
        //given
        const secret: string = process.env.JWT_SECRET_KEY;
        const token = jwt.sign(user, secret);
        jest.spyOn(userRepository, "getUsers").mockReturnValueOnce([{role: "super"}]);
        //when
        const { statusCode } = await request(app)
            .post("/users")
            .set('Authorization', 'Bearer ' + token);
        //then
        expect(statusCode).toEqual(403);
    });
});