import {SRPParameters, SRPRoutines, SRPServerSession, SRPServerSessionStep1} from "tssrp6a";
import {
    CompareRequest,
    SRPAuthRequest,
    SRPChallengeRequest,
    SRPPullRequest,
    SRPPushRequest,
} from "../models/request/AuthenticationReq.interface";
import {
    CompareResponse,
    SRPAuthResponse,
    SRPChallengeResponse,
    SRPPullResponse,
    SRPPushResponse
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
                console.log("uploaded fingerprint: " + body.fingerprint);
                console.log("db fingerprint: " + data.rows[0].fingerprint.replace(/-/g, ""));
                if(body.fingerprint === data.rows[0].fingerprint.replace(/-/g, "")){
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

                const s = BigInt(emailData.salt);
                const v = BigInt(emailData.verifier)

                const server = new SRPServerSession(new SRPRoutines(new SRPParameters()));
                const serverStep1 = await server.step1(body.email, s, v);
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
                            salt: s,
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
                console.log("Step1State:" + stateData.Step1State)
                const serverStep1 = SRPServerSessionStep1.fromState(
                    new SRPRoutines(new SRPParameters()),
                    JSON.parse(stateData.Step1State),);

                //Attempt Verification of User Credentials
                try {
                    const verificationMessage2 = await serverStep1.step2(BigInt(body.A), BigInt(body.verificationMessage1));
                    return {
                        code: 200,
                        message: {vM2: verificationMessage2}
                    }
                } catch(e) {
                    return {
                        code : 400,
                        message : e.message
                    }
                }
            }
        }

        async pull(body: SRPPullRequest): Promise<SRPPullResponse> {
            if(this.pullDetailsAreValid(body)){
                const [stateData, stateErr] = await vaultRepository.retrieveServerState(body.email);
                if(stateErr){
                    return {
                        code: 400,
                        message: {
                          error : "Database Error"
                        }
                    }
                } else {
                    console.log("Step1State:" + stateData.Step1State)
                    const serverStep1 = SRPServerSessionStep1.fromState(
                        new SRPRoutines(new SRPParameters()),
                        JSON.parse(stateData.Step1State),);
                    //Attempt Verification of User Credentials
                    try {
                        await serverStep1.step2(BigInt(body.A), BigInt(body.verificationMessage1));
                    } catch(e) {
                        return {
                            code : 400,
                            message : {
                                error : "Database Error"
                            }
                        }
                    }
                    //getUserData
                    const [userData, error] = await vaultRepository.getUserData(body.email);
                    if(error){
                        return {
                            code : 400,
                            message : {
                                error: "Database Error"
                            }
                        }
                    }else {
                        return {
                            code: 200,
                            message: {
                                data : {
                                    user_data: userData.user_data,
                                    user_iv: userData.user_iv,
                                    user_authtag: userData.user_authtag,
                                    user_salt: userData.user_salt,
                                }
                            }
                        }
                    }

                    //should delete server state
                }
            } else {
                return {
                    code:400,
                    message: {
                        error: "Details Invalid"
                    }
                }
            }
        }

        async push(body: SRPPushRequest): Promise<SRPPushResponse> {
            if(this.pushDetailsAreValid(body)){
                const [stateData, stateErr] = await vaultRepository.retrieveServerState(body.email);
                if(stateErr){
                    return {
                        code: 400,
                        message: "Database Error"
                    }
                } else {
                    console.log("Step1State:" + stateData.Step1State)
                    const serverStep1 = SRPServerSessionStep1.fromState(
                        new SRPRoutines(new SRPParameters()),
                        JSON.parse(stateData.Step1State),);
                    //Attempt Verification of User Credentials
                    try {
                        await serverStep1.step2(BigInt(body.A), BigInt(body.verificationMessage1));
                    } catch(e) {
                        return {
                            code : 400,
                            message : "Error"
                        }
                    }
                    //Update Data and fingerprint
                    const [result, error] = await vaultRepository.updateUserData(body);
                    if(error){
                        return {
                            code : 400,
                            message : "Error"
                        }
                    }else {
                        return {
                            code: 200,
                            message: "Success"
                        }
                    }
                }
            } else {
                return {
                    code:400,
                    message: "Details Invalid"
                }
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
            body.hasOwnProperty("user_data") &&
            body.hasOwnProperty("fingerprint") &&
            body.hasOwnProperty("user_iv") &&
            body.hasOwnProperty("user_authtag") &&
            body.hasOwnProperty("user_salt") &&
            isNaN(Number(body.email)) &&
            !isNaN(Number(body.A)) &&
            !isNaN(Number(body.verificationMessage1)) &&
            isNaN(Number(body.user_data)) &&
            isNaN(Number(body.fingerprint)) &&
            isNaN(Number(body.user_iv)) &&
            isNaN(Number(body.user_authtag)) &&
            isNaN(Number(body.user_salt));
    }

    pullDetailsAreValid(body: SRPPullRequest): boolean{
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