import authenticationService from "../services/Authentication.Service";
import {randomBytes} from "crypto";

const service = authenticationService

/*





export interface SRPDeleteRequest {
    email : string,
    A : bigint,
    verificationMessage1 : bigint
}
 */

describe("Authentication Service: Challenge Details Validation",  () => {
    it("Should Return False if Request Body is null  ", async () => {
        //given
        const body = {};
        // when
        const isValid =  service.challengeDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);
    })

    it("Should Return False if email is a number ", async () => {
        //given
        const body = {
            email : 4585874857547,
        };
        //when
        const isValid =  service.challengeDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);
    })

    it("Should Return True if Details are correct ", async () => {
        //given
        const body = {
            email : "name@example.com",
        };
        //then
        const isValid =  service.challengeDetailsAreValid(body as any);
        //when
        expect(isValid).toEqual(true);
    })
})

describe("Authentication Service: Authentication Details Validation",  () => {
    it("Should Return False if Request Body is null  ", async () => {
        //given
        const body = {};
        // when
        const isValid = service.authenticateDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);
    })

    it("Should Return False if any field is nonexistent ", async () => {
        //given
        const body = {
            email: "name@example.com",
            A: 54545454554545,
        };
        //when
        const isValid = service.authenticateDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);
    })

    it("Should Return False if salt or verifier are not numbers ", async () => {
        //given
        const body = {
            email: "name@example.com",
            A: 1111111111111111,
            verificationMessage1: randomBytes(16).toString('hex')
        };
        //when
        const isValid = service.authenticateDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);
    })

    it("Should Return True if Details are correct ", async () => {
        //given
        const body = {
            email: "name@example.com",
            A: 1111111111111111111111111,
            verificationMessage1: 1111111111111111111111
        };
        //when
        const isValid = service.authenticateDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(true);
    })

})

describe("Authentication Service: Compare Details Validation", () => {
    it("Should Return False if Request Body is null", async () => {
        //given
        const body = {};
        // when
        const isValid = service.compareDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);
    })

    it("Should Return False if fingerprint is nonexistent", async () => {
        //given
        const body = {
            email: "name@example.com",
        };
        //when
        const isValid = service.compareDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);
    })

    it("Should Return False if fingerprint is a number ", async () => {
        //given
        const body = {
            email: "name@example.com",
            fingerprint: 1111111111111111111111
        };
        //when
        const isValid = service.compareDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);
    })

    it("Should Return True if Details are correct ", async () => {
        //given
        const body = {
            email: "name@example.com",
            fingerprint: randomBytes(16).toString('hex')
        }
        //when
        const isValid = service.compareDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(true);
    })
})

describe("Authentication Service: Pull Details Validation", () => {
    it("Should Return False if Request Body is null", async () => {
        //given
        const body = {};
        // when
        const isValid = service.pullDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);
    })

    it("Should Return False if one field is nonexistent", async () => {
        //given
        const body = {
            email: "name@example.com",
            verificationMessage1 : 111111111111111,
        };
        //when
        const isValid = service.pullDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);
    })

    it("Should Return False if fingerprint or vM1 is not a number ", async () => {
        //given
        const body = {
            email: "name@example.com",
            fingerprint: 1111111111111111111111,
            verificationMessage1 : 1111111111111111111,
        };
        //when
        const isValid = service.pullDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);
    })

    it("Should Return True if Details are correct", async () => {
        //given
        const body = {
            email: "name@example.com",
            A: 11111111111111111111111111,
            verificationMessage1 : 11111111111111111111111
        }
        //when
        const isValid = service.pullDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(true);
    })
})

describe("Authentication Service: Push Details Validation", () => {
    it("Should Return False if Request Body is null", async () => {
        //given
        const body = {};
        // when
        const isValid = service.pushDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);
    })

    it("Should Return False if one field is nonexistent", async () => {
        //given
        const body = {
            email: "name@example.com",
            verificationMessage1 : 111111111111111,
            user_data: randomBytes(16).toString('hex'),
            fingerprint: randomBytes(16).toString('hex'),
            user_iv: randomBytes(16).toString('hex'),
            user_authtag: randomBytes(16).toString('hex'),
            user_salt: randomBytes(16).toString('hex'),
        };
        //when
        const isValid = service.pushDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);
    })

    it("Should Return False if a BigInt is not a number ", async () => {
        //given
        const body = {
            email: "name@example.com",
            A : 11111111111,
            verificationMessage1 : randomBytes(16).toString('hex'),
            user_data: randomBytes(16).toString('hex'),
            fingerprint: randomBytes(16).toString('hex'),
            user_iv: randomBytes(16).toString('hex'),
            user_authtag: randomBytes(16).toString('hex'),
            user_salt: randomBytes(16).toString('hex'),
        };
        //when
        const isValid = service.pushDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);
    })

    it("Should Return True if Details are correct", async () => {
        //given
        const body = {
            email: "name@example.com",
            A : 11111111111111,
            verificationMessage1 : 1111111111111111111111111,
            user_data: randomBytes(16).toString('hex'),
            fingerprint: randomBytes(16).toString('hex'),
            user_iv: randomBytes(16).toString('hex'),
            user_authtag: randomBytes(16).toString('hex'),
            user_salt: randomBytes(16).toString('hex'),
        }
        //when
        const isValid = service.pushDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(true);
    })
})

describe("Authentication Service: Delete Details Validation", () => {
    it("Should Return False if Request Body is null", async () => {
        //given
        const body = {};
        // when
        const isValid = service.deleteDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);
    })

    it("Should Return False if one field is nonexistent", async () => {
        //given
        const body = {
            email: "name@example.com",
            verificationMessage1 : 111111111111111,
        };
        //when
        const isValid = service.deleteDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);
    })

    it("Should Return False if fingerprint or vM1 is not a number ", async () => {
        //given
        const body = {
            email: "name@example.com",
            fingerprint: 1111111111111111111111,
            verificationMessage1 : 1111111111111111111,
        };
        //when
        const isValid = service.deleteDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);
    })

    it("Should Return True if Details are correct", async () => {
        //given
        const body = {
            email: "name@example.com",
            A: 11111111111111111111111111,
            verificationMessage1 : 11111111111111111111111
        }
        //when
        const isValid = service.deleteDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(true);
    })
})


