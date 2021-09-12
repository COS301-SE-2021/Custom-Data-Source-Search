import {SRPParameters, SRPRoutines, SRPServerSession, SRPServerSessionStep1} from "tssrp6a";
import {
    CompareRequest,
    SRPAuthRequest,
    SRPChallengeRequest, SRPPullRequest, SRPPushRequest,
} from "../models/request/AuthenticationReq.interface";
import {
    CompareResponse,
    SRPAuthResponse,
    SRPChallengeResponse,
    SRPPullResponse, SRPPushResponse
} from "../models/response/AuthenticationResp.interface";
import vaultRepository from "../repository/Vault.Repository";

class AuthenticationService {

    async compare(body: CompareRequest): Promise<CompareResponse>{

        if(this.compareDetailsAreValid(body)){

            const [data, err] = await vaultRepository.getFingerprint(body.email);
            if(err){
                return {
                    code: 400,
                    message: err
                }
            } else {

                if(body.fingerprint == data.rows[0].fingerprint){
                    return {
                        code: 200,
                        message: {
                            isOutOfSync: false
                        }
                    }
                } else {
                    return {
                        code: 200,
                        message: {
                            isOutOfSync: true
                        }
                    }
                }
            }

        } else {
            return {
                code:400,
                message: {
                    error: "Invalid Details"
                }
            }
        }

    }

    async challenge(body: SRPChallengeRequest): Promise<SRPChallengeResponse> {

        if (this.challengeDetailsAreValid(body)){

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
                const [stateData , stateErr ] = await vaultRepository.storeServerState(body.email, serializedServerStep1)

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

        async pull(body: SRPPullRequest): SRPPullResponse {

       // if(pushDetailsAreValid(body)){
//
            //retrieve sever state from db
 //           const [ stateData, stateErr] = await vaultRepository.retrieveServerState(body.email);
//
  //      } else {

  //      }



        }

        async push(body: SRPPushRequest): Promise<SRPPushResponse> {

            if(this.pushDetailsAreValid(body)){
                const [ stateData, stateErr] = await vaultRepository.retrieveServerState(body.email);
                if(stateErr){
                    return {
                        code : 400,
                        message : "Database Error"
                    }
                } else {

                    const serverStep1 = SRPServerSessionStep1.fromState(
                        new SRPRoutines(new SRPParameters()),
                        JSON.parse(stateData.Step1State),
                    );

                    //Attempt Verification of User Credentials
                    try {
                        await serverStep1.step2(body.A, body.verificationMessage1);

                        //Update Data and fingerprint
                        const [ stateData, stateErr] = await vaultRepository.updateUserData(body.data, body.fingerprint);


                    } catch(e) {
                        return {
                            code : 400,
                            message : "Error"
                        }
                    }
                }
            } else {
            }
        }

    challengeDetailsAreValid(body: SRPChallengeRequest): boolean{
        return body.hasOwnProperty("email") && isNaN(Number(body.email));
    }

    authenticateDetailsAreValid(body: SRPAuthRequest): boolean{
        return body.hasOwnProperty("email") &&
            body.hasOwnProperty("A") &&
            body.hasOwnProperty("verificationMessage1") &&
            isNaN(Number(body.email)) &&
            !isNaN(Number(body.A)) &&
            !isNaN(Number(body.verificationMessage1));
    }
    compareDetailsAreValid(body: CompareRequest): boolean{
        return body.hasOwnProperty("email") &&
            body.hasOwnProperty("fingerprint") &&
            isNaN(Number(body.email)) &&
            isNaN(Number(body.fingerprint));
    }

    pushDetailsAreValid(body: SRPPushRequest): boolean{
        return body.hasOwnProperty("email") &&
            body.hasOwnProperty("A") &&
            body.hasOwnProperty("verificationMessage1") &&
            body.hasOwnProperty("data") &&
            body.hasOwnProperty("fingerprint") &&
            isNaN(Number(body.email)) &&
            !isNaN(Number(body.A)) &&
            !isNaN(Number(body.verificationMessage1)) &&
            isNaN(Number(body.data)) &&
            isNaN(Number(body.fingerprint));
    }
}

const authenticationService = new AuthenticationService();
export default authenticationService;