import {createVerifierAndSalt, SRPParameters, SRPRoutines} from "tssrp6a";
import {isNumber, isString} from "util";
import {type} from "os";
import {SRPRegistrationRequest} from "../models/request/RegistrationReq.interface";
import {SRPRegistrationResponse} from "../models/response/RegistrationResp.interface";
import vaultRepository from "../repository/Vault.Repository";

class RegistrationService {

    async register(body: SRPRegistrationRequest): Promise<SRPRegistrationResponse> {
        if(this.detailsAreValid(body)){
            const [data, err] = await vaultRepository.addUser(body.email, body.salt, body.verifier);

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
                code: 400,
                message: "Details Invalid"
            }
        }
    }

    detailsAreValid(body : SRPRegistrationRequest) : boolean {

        return body.hasOwnProperty("email") &&
               body.hasOwnProperty("salt") &&
               body.hasOwnProperty("verifier") &&
               !isNaN(Number(body.salt)) &&
               !isNaN(Number(body.verifier));

    }

}

const registrationService = new RegistrationService();
export default registrationService;