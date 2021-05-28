import express from "express"

const app = express();
app.listen(3001, () => {
    console.log('started');
})

app.get('/', (req,res) =>{
    add(6);
    res.send( "Hello world!");
    console.log('Added');
   })


const add = (a: number, b?: number): number => {

    if(b){
        return a + b;
    }else {
        return a + 1;
    }
    
}

console.log("Completed.");