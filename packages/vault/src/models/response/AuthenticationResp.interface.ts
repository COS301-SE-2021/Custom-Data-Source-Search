export interface SRPChallengeResponse {
    code : number,
    message: string | SRPSaltAndVerifier,

}

export interface SRPSaltAndVerifier{

    salt : bigint,
    verifier : bigint

}