import express from "express"

const app = express();
app.listen(3001, () => {
    console.log('Started Server');
})

app.get('/', (req,res) =>{
    add(6);
    res.send( "Hello world!");
    console.log('Root Accessed');
   })


/**
 *
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
