import authenticationService from "../services/Authentication.Service";

const service = authenticationService

describe("Authentication Service : Challenge Details Validation",  () => {
    it("Should Return False if Request Body is null  ", async () => {

        //given
        const body = {};
        // when
        const isValid =  service.challengeDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);

    })


    it("Should Return False if email is a number ", async () => {

        const body = {
            email : 4585874857547,
        };

        const isValid =  service.challengeDetailsAreValid(body as any);

        expect(isValid).toEqual(false);

    })

    it("Should Return True if Details are correct ", async () => {

        const body = {
            email : "name@example.com",
        };

        const isValid =  service.challengeDetailsAreValid(body as any);

        expect(isValid).toEqual(true);

    })

})

describe("Authentication Service : Authentication Validation",  () => {
    it("Should Return False if Request Body is null  ", async () => {

        //given
        const body = {};
        // when
        const isValid =  service.authenticateDetailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);

    })

    it("Should Return False if any field is nonexistent ", async () => {

        const body = {
            email : "example.com",
            A : 54545454554545,
        };

        const isValid =  service.authenticateDetailsAreValid(body as any);

        expect(isValid).toEqual(false);

    })

    it("Should Return False if salt or verifier are not numbers ", async () => {

        const body = {
            email : "example.com",
            A : 54545454554545,
            verificationMessage1: "fhgfh5445dfhf"
        };

        const isValid =  service.authenticateDetailsAreValid(body as any);

        expect(isValid).toEqual(false);

    })

    it("Should Return True if Details are correct ", async () => {

        const body = {
            email : "example.com",
            A : 54545454554545,
            verificationMessage1: 12345677894
        };

        const isValid =  service.authenticateDetailsAreValid(body as any);

        expect(isValid).toEqual(true);

    })

})