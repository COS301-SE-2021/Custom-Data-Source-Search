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

            const result = {
                salt : data.rows[0].salt
            }

            return[result, null]
        } catch (e){
            console.log(e.stack);
            return[null, e]
        }

    }


}

const vaultRepository = new VaultRepository();
export default vaultRepository;