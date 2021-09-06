import {SRPParameters, SRPRoutines, SRPServerSession, SRPServerSessionStep1} from "tssrp6a";
import {SRPAuthRequest, SRPChallengeRequest} from "../models/request/AuthenticationReq.interface";
import {SRPAuthResponse, SRPChallengeResponse} from "../models/response/AuthenticationResp.interface";
import vaultRepository from "../repository/Vault.Repository";

//declare var server: SRPServerSession;
//declare var serverStep1 : SRPServerSessionStep1

class AuthenticationService {

    async challenge(body: SRPChallengeRequest) : Promise<SRPChallengeResponse> {

        if (this.challengeDetailsAreValid(body)) {

            const [emailData, emailErr] = await vaultRepository.getSaltAndVerifier(body.email);
            if (emailErr) {
                return {
                    code: 400,
                    message: emailErr
                }
            } else {

                const server = new SRPServerSession(new SRPRoutines(new SRPParameters()));
                const serverStep1 = await server.step1(body.email, emailData.salt, emailData.verifier);
                const serializedServerStep1 = JSON.stringify(serverStep1);

                //Store serialized sever state at this point
                const [stateData , stateErr ] = await vaultRepository.storeServerState(body.email,serializedServerStep1)

                if(stateErr){
                    return {
                        code : 400,
                        message : "Internal Error"
                    }
                } else {
                    return {
                        code: 200,
                        message: {
                            salt: emailData.salt,
                            B: serverStep1.B
                        }
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

            //retrieve server state from db
            const [ stateData, stateErr] = await vaultRepository.retrieveServerState(body.email);
            if(stateErr){
                return {
                    code : 400,
                    message : "Internal Error"
                }
            } else {

               // const serverStep1 = SRPServerSessionStep1.fromState(
               //     new SRPRoutines(new SRPParameters()),
              //      JSON.parse(stateData.Step1State),
               // );

                //Attempt Verification of User Credentials
                try {
                   // const verificationMessage2 = await serverStep1.step2(body.A, body.verificationMessage1);


                    return {
                        code: 200,
                      //  message: {vM2: verificationMessage2}
                          message: {vM2: stateData.rows[0].Step1State}

                    }
                } catch(e) {
                    return {
                        code : 400,
                        message : "Error"
                    }
                }

            }
        }

    authenticateDetailsAreValid(body: SRPAuthRequest): boolean{
        return body.hasOwnProperty("email") &&
            body.hasOwnProperty("A") &&
            body.hasOwnProperty("verificationMessage1") &&
            isNaN(Number(body.email)) &&
            !isNaN(Number(body.A)) &&
            !isNaN(Number(body.verificationMessage1));

    }

}

const authenticationService = new AuthenticationService();
export default authenticationService;