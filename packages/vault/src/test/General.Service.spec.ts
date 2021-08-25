import generalService from "../services/General.Service";

const service = generalService

describe("General Service Test: ", () => {
    it("Should return supplied ", () => {
        const number = 5
        const result = service.test(number)

        expect(result.body.message === number)

    })

})

