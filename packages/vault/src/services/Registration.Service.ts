import {createVerifierAndSalt, SRPParameters, SRPRoutines} from "tssrp6a";
import {isNumber, isString} from "util";
import {type} from "os";
import {SRPRegistrationRequest} from "../models/request/RegistrationReq.interface";
import {SRPRegistrationResponse} from "../models/response/RegistrationResp.interface";
import vaultRepository from "../repository/Vault.Repository";

class RegistrationService {
    async register(body: SRPRegistrationRequest): Promise<SRPRegistrationResponse> {
        console.log("Registering User");
        if(this.detailsAreValid(body)){
            const [userExists, UserExistsErr] = await vaultRepository.checkIfUserExists(body.email);
            if(userExists) {
                const [data, err] = await vaultRepository.addUser(body);
                if (err) {
                    return {
                        code: 400,
                        message: err
                    }
                } else {
                    return {
                        code: 200,
                        message: "Success"
                    }
                }
            } else {
                return {
                    code: 403,
                    message: "User Already Exists"
                }
            }
        } else {
            return {
                code: 400,
                message: "Details Invalid"
            }
        }
    }

    detailsAreValid(body : SRPRegistrationRequest) : boolean {
        return body.hasOwnProperty("email") &&
               body.hasOwnProperty("salt") &&
               body.hasOwnProperty("verifier") &&
               body.hasOwnProperty("user_data") &&
               body.hasOwnProperty("fingerprint") &&
               body.hasOwnProperty("user_iv") &&
               body.hasOwnProperty("user_authtag") &&
               body.hasOwnProperty("user_salt") &&
               isNaN(Number(body.email)) &&
               !isNaN(Number(body.salt)) &&
               !isNaN(Number(body.verifier)) &&
               isNaN(Number(body.user_data)) &&
               isNaN(Number(body.fingerprint)) &&
               isNaN(Number(body.user_iv)) &&
               isNaN(Number(body.user_authtag)) &&
               isNaN(Number(body.user_salt));
    }
}

const registrationService = new RegistrationService();
export default registrationService;