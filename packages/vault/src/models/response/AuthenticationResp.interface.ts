export interface SRPChallengeResponse {
    code : number,
    message: string | SRPSaltAndB,
}

export interface SRPSaltAndB{

    salt : bigint,
    B : bigint
}

export interface SRPAuthResponse {
    code : number,
    message : string | VerificationMessage2
}
export interface VerificationMessage2 {
    vM2 : bigint | string
}