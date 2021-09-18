export interface SRPChallengeRequest {
    email : string,
}

export interface SRPAuthRequest {
    email : string,
    A : bigint,
    verificationMessage1 : bigint
}

export interface CompareRequest {
    email: string,
    fingerprint : string
}

export interface SRPPullRequest {
    email : string,
    A : bigint,
    verificationMessage1 : bigint
}

export interface SRPPushRequest {
    email : string,
    A : bigint,
    verificationMessage1 : bigint
    user_data: string,
    fingerprint: string,
    user_iv: string,
    user_authtag: string,
    user_salt: string,


}