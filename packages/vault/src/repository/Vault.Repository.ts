import {SRPRegistrationRequest} from "../models/request/RegistrationReq.interface";
import {createHash} from "crypto";
import {SRPPullRequest, SRPPushRequest} from "../models/request/AuthenticationReq.interface";
const db = require("../config/db.config");

class VaultRepository {
    async addUser(body : SRPRegistrationRequest){
        try {
            const client = await db.connect();
            const result = await client.query(
                'INSERT INTO "Users" (email,' +
                ' salt,' +
                ' verifier,' +
                ' user_data,' +
                ' fingerprint,' +
                ' user_iv,' +
                ' user_authtag,' +
                ' user_salt) ' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                [body.email,
                    body.salt,
                    body.verifier,
                    body.user_data,
                    body.fingerprint,
                    body.user_iv,
                    body.user_authtag,
                    body.user_salt],
            );
            client.release()
            return[result, null]
        } catch (e){
            console.log(e.stack);
            return[null, e]
        }
    }

    async getSaltAndVerifier(email: string){
        try {
            const client = await db.connect();
            const data = await client.query(
                'SELECT salt, verifier FROM "Users" WHERE email = $1',
                [email],
            );
            const result = {
                salt: data.rows[0].salt,
                verifier: data.rows[0].verifier
            }
            client.release();
            return[result, null]
        } catch (e){
            console.log(e.stack);
            return[null, e]
        }
    }

    async getFingerprint(email: string){
        try {
            const client = await db.connect();
            const data = await client.query(
                'SELECT fingerprint FROM "Users" WHERE email = $1',
                [email],
            );
            client.release()
            return[data, null]
        } catch (e){
            console.log(e.stack);
            return[null, e]
        }

    }

    async updateUserData(body: SRPPushRequest){
        try {
            const client = await db.connect();
            const result = await client.query(
                'UPDATE "Users"' +
                'SET user_data =  $2,' +
                'fingerprint = $3,' +
                'user_iv = $4,' +
                'user_authtag = $5,' +
                'user_salt = $6' +
                'WHERE email = $1',
                [body.email, body.user_data, body.fingerprint, body.user_iv, body.user_authtag, body.user_salt],
            );
            client.release();
            return[result, null]
        } catch (e){
            console.log(e.stack);
            return[null, e]
        }
    }

    async storeServerState(email: string, state: string){
        try {
            const client = await db.connect();
            const data = await client.query(
                'INSERT INTO "SRPSessionStates" (email, "Step1State")' +
                'VALUES($1, $2) ' +
                'ON CONFLICT (email) DO UPDATE ' +
                'SET email=$1, ' +
                '"Step1State"=$2',
                [email,state],
            );
            client.release();
            return[data, null]
        } catch (e){
            console.log(e.stack);
            return[null, e]
        }
    }

    async retrieveServerState(email: string){
        try {
            const client = await db.connect();
            const data = await client.query(
                'SELECT "Step1State" FROM "SRPSessionStates" WHERE email = $1',
                [email],
            );

            const result = {
                Step1State : data.rows[0].Step1State
            }
            client.release();
            return[result, null]
        } catch (e){
            console.log(e.stack);
            return[null, e]
        }
    }

    async getUserData(email: string){
        try {
            const client = await db.connect();
            const data = await client.query(
                'SELECT user_data, user_iv, user_authtag, user_salt FROM "Users" WHERE email = $1',
                [email],
            );

            const result = data.rows[0];
            client.release();
            return[result, null]
        } catch (e){
            console.log(e.stack);
            return[null, e]
        }
    }
}

const vaultRepository = new VaultRepository();
export default vaultRepository;