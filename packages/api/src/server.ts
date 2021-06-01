/**
 * Require External Modules
 */

import express from "express"
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { textDataSourceRouter } from  "./routers/TextDataSource.router";
import ExampleDataSource from "./ExampleDataSource";

//temporary
const exampleDataSource = new ExampleDataSource("file.txt");

dotenv.config({path: __dirname + `/../../../.env`});
console.log(__dirname);



/**
 * App Variables
 */

if (!process.env.PORT) {
    console.log("Can't find .env");
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();


/**
 * App Configuration
 */

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/textdatasources", textDataSourceRouter);


app.listen(PORT , () => {
    console.log(`Listening on port ${PORT}`);
})


/*
app.get('/', (req,res) =>{
    let six : number = add(6);
    res.send( `Hello world! ${six}`);
    console.log('Root Accessed');
   })

   */



/**
 * @param {number} a - The primary value
 * @param {number} b - The optional secondary value
 * @returns {number} - returns either the sum of a and b or the sum of a and 2
 * @author Joshua Walker
 */

/*
function add (a: number, b?: number): number {

    if(b){
        return a + b;
    }else {
        return a + 2;
    }




}

*/
