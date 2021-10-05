import express from "express"
import helmet from "helmet";
import cors from "cors";
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

const port = process.env.VAULT_PORT || 8080;
const server = app.listen(port , () => {
    console.log("Server Started");
    console.log(`Listening on port ` + port);
    console.log("DB name: " + process.env.VDB_db);
});

export default server
