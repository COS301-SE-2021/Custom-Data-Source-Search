import express from "express"
import ExampleDataSource from "./ExampleDataSource";

const app = express();
const exampleDataSource = new ExampleDataSource("file.txt");


app.listen(3001, () => {
    console.log('Started Server');
    console.log('Using file', exampleDataSource.getFileName());
})

app.get('/', (req,res) =>{
    let six : number = add(6);
    res.send( `Hello world! This Is It! ${six}`);
    console.log('Root Accessed');
   })


/**
 * @param {number} a - The primary value
 * @param {number} b - The optional secondary value
 * @returns {number} - returns either the sum of a and b or the sum of a and 2
 * @author Joshua Walker
 */
function add (a: number, b?: number): number {

    if(b){
        return a + b;
    }else {
        return a + 2;
    }
    
}
