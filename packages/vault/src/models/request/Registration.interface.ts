export interface SRPRegistrationRequest {

    email : string,
    salt: bigint,
    verifier: bigint
}
