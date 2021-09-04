import authenticationService from "../services/Authentication.Service";

const service = authenticationService

describe("Registration Service : Challenge Details Validation",  () => {
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