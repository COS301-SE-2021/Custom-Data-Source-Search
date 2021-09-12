export interface SRPChallengeResponse {
    code: number,
    message: string | SRPSaltAndB,
}

export interface SRPSaltAndB{

    salt: bigint,
    B: bigint
}

export interface SRPAuthResponse {
    code: number,
    message: string | VerificationMessage2
}
export interface VerificationMessage2 {
    vM2: bigint | string
}

export interface CompareResponse {
    code: number,
    message: {
        error? : string,
        isOutOfSync?: boolean
    },

}

export interface SRPPullResponse {
    code: number,
    message: {
        data : string
    }
}

export interface SRPPushResponse {
    code: number,
    message: string
}