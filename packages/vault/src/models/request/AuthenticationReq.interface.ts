export interface SRPChallengeRequest {
    email : string,
}

export interface SRPAuthRequest {

    A : bigint;
    verificationMessage1 : bigint;

}