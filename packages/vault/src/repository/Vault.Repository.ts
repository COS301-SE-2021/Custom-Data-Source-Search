import {SRPRegistrationRequest} from "../models/request/RegistrationReq.interface";

const db = require("../config/db.config");

class VaultRepository {

    async addUser(body : SRPRegistrationRequest){
        try {
            const result = await db.query(
                'INSERT INTO "Users" (email, salt, verifier, data, fingerprint) VALUES ($1, $2, $3, $4, $5)',
                [body.email, body.salt, body.verifier, body.data, body.fingerprint],
            );
            return[result, null]
        } catch (e){
            console.log(e.stack);
            return[null, e]
        }
    }

    async getSaltAndVerifier(email: string){
        try {
            const data = await db.query(
                'SELECT salt, verifier FROM "Users" WHERE email = $1',
                [email],
            );
            const result = {
                salt: data.rows[0].salt,
                verifier: data.rows[0].verifier
            }
            return[result, null]
        } catch (e){
            console.log(e.stack);
            return[null, e]
        }
    }

    async getFingerprint(email: string){
        try {
            const data = await db.query(
                'SELECT fingerprint FROM "Users" WHERE email = $1',
                [email],
            );
            return[data, null]
        } catch (e){
            console.log(e.stack);
            return[null, e]
        }

    }

    async updateUserData(email: string, data: string, fingerprint: string){
        try {
            const result = await db.query(
                'UPDATE "Users"' +
                'SET  data =  $2' +
                'SET fingerprint = $3' +
                'WHERE email = $1',
                [email, data, fingerprint],
            );
            return[result, null]
        } catch (e){
            console.log(e.stack);
            return[null, e]
        }
    }

    async storeServerState(email: string, state: string){
        try {
            const data = await db.query(
                'INSERT INTO "SRPSessionStates" (email, "Step1State")' +
                'VALUES($1, $2) ' +
                'ON CONFLICT (email) DO UPDATE ' +
                'SET email=$1, ' +
                '"Step1State"=$2',
                [email,state],
            );

            return[data, null]
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

            const result = {
                Step1State : data.rows[0].Step1State
            }
            return[result, null]
        } catch (e){
            console.log(e.stack);
            return[null, e]
        }
    }

    async getUserData(email: string){
        try {
            const data = await db.query(
                'SELECT data FROM "Users" WHERE email = $1',
                [email],
            );

            const result = data.rows[0].data;

            return[result, null]
        } catch (e){
            console.log(e.stack);
            return[null, e]
        }
    }
}

const vaultRepository = new VaultRepository();
export default vaultRepository;