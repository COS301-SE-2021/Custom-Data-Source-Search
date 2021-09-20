import registrationService from "../services/Registration.Service";
import {randomBytes} from "crypto";

const service = registrationService

describe("Registration Service: Detail Validation",  () => {
    it("Should Return False if Request Body is null", async () => {
        //given
        const body = {};
        //when
        const isValid = service.detailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);
    })

    it("Should Return False if any field is nonexistent ", async () => {
        //given
        const body = {
            email : "name@example.com",
            salt : 111111111111,
            verifier: 11111111111,
            user_data : randomBytes(16).toString('hex'),
            user_iv: randomBytes(16).toString('hex'),
            user_authtag: randomBytes(16).toString('hex'),
            user_salt: randomBytes(16).toString('hex')
        };
        //when
        const isValid = service.detailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);
    })

    it("Should Return False if salt or verifier are not numbers ", async () => {
        //given
        const body = {
            email : "name@example.com",
            salt : 111111111111,
            verifier: randomBytes(16).toString('hex'),
            user_data : randomBytes(16).toString('hex'),
            fingerprint: randomBytes(16).toString('hex'),
            user_iv: randomBytes(16).toString('hex'),
            user_authtag: randomBytes(16).toString('hex'),
            user_salt: randomBytes(16).toString('hex')
        };
        //when
        const isValid =  service.detailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);
    })

    it("Should Return True if Details are correct ", async () => {
        //given
        const body = {
            email : "name@example.com",
            salt : 111111111111,
            verifier: 1111111111111,
            user_data : randomBytes(16).toString('hex'),
            fingerprint: randomBytes(16).toString('hex'),
            user_iv: randomBytes(16).toString('hex'),
            user_authtag: randomBytes(16).toString('hex'),
            user_salt: randomBytes(16).toString('hex')
        };
        //when
        const isValid = service.detailsAreValid(body as any);
        //then
        expect(isValid).toEqual(true);
      })
})