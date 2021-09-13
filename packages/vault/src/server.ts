import express from "express"
import cors from "cors";
import helmet from "helmet";
import {generalRouter} from "./router/General.Router";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.set('json replacer', customStringify)
app.use("/vault", generalRouter)


function customStringify(key: any, value: any){
        if(typeof value === 'bigint') {
            return value.toString()
        }else {
            return value
        }
}

const server = app.listen(3002 , () => {
    console.log("Server Started");
    console.log(`Listening on port 3002`);
});

export default server
