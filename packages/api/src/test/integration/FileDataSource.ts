import express from "express";
import {fileDataSourceRouter} from "../../routers/FileDataSource.router";
const request = require("supertest"); // supertest is a framework that allows to easily test web apis
const app = express(); //an instance of an express app, a 'fake' express app
app.use("/filedatasources", fileDataSourceRouter); //routes
describe("Testing file datasource routes", () => {
    it("GET /states - success", async () => {
        const { body } = await request(app).get("/filedatasources"); //uses the request function that calls on express app instance
        console.log(body);
        expect(body).toEqual([
            {
                state: "NJ",
                capital: "Trenton",
                governor: "Phil Murphy",
            },
            {
                state: "CT",
                capital: "Hartford",
                governor: "Ned Lamont",
            },
            {
                state: "NY",
                capital: "Albany",
                governor: "Andrew Cuomo",
            },
        ]);
    });
});