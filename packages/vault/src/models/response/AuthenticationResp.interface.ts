export interface SRPChallengeResponse {
    code : number,
    message: string | SRPSaltAndVerifier,
}

export interface SRPSaltAndVerifier{

    alt : bigint,
    B : bigint
}

export interface SRPAuthResponse {

}