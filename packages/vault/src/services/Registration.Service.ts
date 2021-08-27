import {createVerifierAndSalt, SRPParameters, SRPRoutines} from "tssrp6a";
import {isString} from "util";
import {type} from "os";
import {SRPRegistrationRequest} from "../models/request/Registration.interface";
import {StandardResponse} from "../models/response/General.interface";
import vaultRepository from "../repository/Vault.Repository";

class RegistrationService {


    async register(body: SRPRegistrationRequest): Promise<StandardResponse> {

        if (body.hasOwnProperty("email") &&
            body.hasOwnProperty("salt") &&
            body.hasOwnProperty("verifier")
        ) {

            const [data, err] = await vaultRepository.addUser(body.email, body.salt, body.verifier);

            if (err) {
                return {
                    code: 400,
                    message: "Details Invalid"
                }
            } else {
                return {
                    code: 200,
                    message: "Success"
                }

            }
            //  const srp6aNimbusRoutines = new SRPRoutines(new SRPParameters());
            //   const {s: salt, v: verifier} = await createVerifierAndSalt(srp6aNimbusRoutines, "", "");
    } else {
            return {
                code: 400,
                message: "Details Invalid"
            }
        }
    }

}

const registrationService = new RegistrationService();
export default registrationService;