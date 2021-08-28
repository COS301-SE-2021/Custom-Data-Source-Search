import {createVerifierAndSalt, SRPParameters, SRPRoutines} from "tssrp6a";
import {isNumber, isString} from "util";
import {type} from "os";
import {SRPRegistrationRequest} from "../models/request/Registration.interface";
import {StandardResponse} from "../models/response/General.interface";
import vaultRepository from "../repository/Vault.Repository";

class RegistrationService {

    async register(body: SRPRegistrationRequest): Promise<StandardResponse> {
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