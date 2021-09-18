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
    vM2: bigint
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
        error?: string,
        data? : {
            user_data: string,
            user_iv: string,
            user_authtag: string,
            user_salt: string,
        }
    }
}

export interface SRPPushResponse {
    code: number,
    message: string
}