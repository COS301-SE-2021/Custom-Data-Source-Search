import {SRPParameters, SRPRoutines, SRPServerSession} from "tssrp6a";
import {SRPChallengeRequest} from "../models/request/AuthenticationReq.interface";
import {SRPChallengeResponse} from "../models/response/AuthenticationResp.interface";
import vaultRepository from "../repository/Vault.Repository";

class AuthenticationService {

    /**
     *
     * @param body
     */
    async challenge(body: SRPChallengeRequest) : Promise<SRPChallengeResponse>{

        if(this.challengeDetailsAreValid(body)){

            const server = new SRPServerSession(new SRPRoutines(new SRPParameters()));

            const [err, result] = await vaultRepository.getSaltAndVerifier();

            return {
                code: 400,
                message: "Details Invalid"
            }

        } else {
            return {
                code: 400,
                message: "Details Invalid"
            }
        }



    }

    challengeDetailsAreValid(body: SRPChallengeRequest): boolean{

        return false;

    }

    async authenticate(){

    }

    authenticateDetailsAreValid(body: SRPChallengeRequest): boolean{

        return false;

    }

}

const authenticationService = new AuthenticationService();
export default authenticationService;