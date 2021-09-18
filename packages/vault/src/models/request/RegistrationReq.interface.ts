export interface SRPRegistrationRequest {
    email : string,
    salt: bigint,
    verifier: bigint,
    user_data : string,
    fingerprint: string,
    user_iv: string,
    user_authtag: string,
    user_salt: string
}
