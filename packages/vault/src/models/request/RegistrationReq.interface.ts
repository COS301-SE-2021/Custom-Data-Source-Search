export interface SRPRegistrationRequest {

    email : string,
    salt: bigint,
    verifier: bigint,
    data : string,
    fingerprint: string,
}
