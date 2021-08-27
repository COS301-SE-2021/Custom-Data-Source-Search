import {createVerifierAndSalt, SRPParameters, SRPRoutines} from "tssrp6a";
import {isString} from "util";
import {type} from "os";
import {SRPRegistrationRequest} from "../models/request/Registration.interface";
import {StandardResponse} from "../models/response/General.interface";

class RegistrationService {


    async register(body: SRPRegistrationRequest): Promise<StandardResponse>{

        if( body.hasOwnProperty("email") &&
            body.hasOwnProperty("salt") &&
            body.hasOwnProperty("verifier")
        ){


            return {
                code: 200,
                message: body.email
            }

        } else {

            return {
                code: 400,
                message: "Details Invalid"
            }

        }


      //  const srp6aNimbusRoutines = new SRPRoutines(new SRPParameters());

     //   const {s: salt, v: verifier} = await createVerifierAndSalt(srp6aNimbusRoutines, "", "");

    }

}

const registrationService = new RegistrationService();
export default registrationService;