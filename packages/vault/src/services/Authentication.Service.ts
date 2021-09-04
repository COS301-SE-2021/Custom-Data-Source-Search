import {SRPParameters, SRPRoutines, SRPServerSession} from "tssrp6a";
import {SRPAuthRequest, SRPChallengeRequest} from "../models/request/AuthenticationReq.interface";
import {SRPChallengeResponse} from "../models/response/AuthenticationResp.interface";
import vaultRepository from "../repository/Vault.Repository";

class AuthenticationService {
    /**
     *
     * @param body
     */
    async challenge(body: SRPChallengeRequest) : Promise<SRPChallengeResponse> {

        if (this.challengeDetailsAreValid(body)) {

            const [data, err] = await vaultRepository.getSaltAndVerifier(body.email);
            if (err) {
                return {
                    code: 400,
                    message: err
                }
            } else {
                const server = new SRPServerSession(new SRPRoutines(new SRPParameters()));

                const serverStep1 = await server.step1(body.email, data.salt, data.bigint);

                return {
                    code: 200,
                    message:  {
                        salt : data.salt,
                        B : serverStep1.B
                    }
                }
            }
        } else {
            return {
                code: 400,
                message: "Details Invalid"
            }
        }
    }

    challengeDetailsAreValid(body: SRPChallengeRequest): boolean{
        return body.hasOwnProperty("email") && isNaN(Number(body.email));
    }

    async authenticate(body: SRPAuthRequest): Promise<SRPAuthResponse> {
    }

    authenticateDetailsAreValid(body: SRPChallengeRequest): boolean{
        return body.hasOwnProperty("email");
    }

}

const authenticationService = new AuthenticationService();
export default authenticationService;