const db = require("../config/db.config");

class VaultRepository {

    async addUser(email: string, salt: bigint, verifier: bigint){
        try {
            const data = await db.query(
                "INSERT INTO users (email, salt, verifier) VALUES ($1, $2, $3)",
                [email, salt, verifier],
            );
            return[data, null]
        } catch (e){
            console.log(e.stack);
            return[null, e]
        }
    }

    async getSaltAndVerifier(email: string){
        try {
            const data = await db.query(
                "SELECT salt, verifier FROM users WHERE email = $1",
                [email],
            );
            return[data, null]
        } catch (e){
            console.log(e.stack);
            return[null, e]
        }
    }

    async storeServerState(email : string, state : string){
        try {
            const data = await db.query(
                'INSERT INTO "SRPSessionStates" (email, "Step1State") VALUES($1, $2) ON DUPLICATE KEY UPDATE ' +
                'email=$1, "Step1State"=$2',
                [email,state],
            );
            const result = {
                salt : data.rows[0].salt
            }
            return[result, null]
        } catch (e){
            console.log(e.stack);
            return[null, e]
        }
    }

    async retrieveServerState(email: string){
        try {
            const data = await db.query(
                'SELECT "Step1State" FROM "SRPSessionStates" WHERE email = $1',
                [email],
            );
            return[data, null]
        } catch (e){
            console.log(e.stack);
            return[null, e]
        }
    }
}

const vaultRepository = new VaultRepository();
export default vaultRepository;