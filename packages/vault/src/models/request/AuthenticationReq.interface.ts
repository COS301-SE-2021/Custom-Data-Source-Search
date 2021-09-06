export interface SRPChallengeRequest {
    email : string,
}

export interface SRPAuthRequest {
    email : string,
    A : bigint,
    verificationMessage1 : bigint
}