import registrationService from "../services/Registration.Service";

const service = registrationService

  describe("Registration Service : Detail Validation",  () => {
     it("Should Return False if Request Body is null  ", async () => {

         //given
        const body = {};
        // when
        const isValid =  service.detailsAreValid(body as any);
        //then
        expect(isValid).toEqual(false);

    })

      it("Should Return False if any field is nonexistent ", async () => {

          const body = {
              email : "example.com",
              salt : 54545454554545,
          };

          const isValid =  service.detailsAreValid(body as any);

          expect(isValid).toEqual(false);

      })

      it("Should Return False if salt or verifier are not numbers ", async () => {

          const body = {
              email : "example.com",
              salt : 54545454554545,
              verifier: "fhgfh5445dfhf"
          };

          const isValid =  service.detailsAreValid(body as any);

          expect(isValid).toEqual(false);

      })

      it("Should Return True if Details are correct ", async () => {

          const body = {
              email : "example.com",
              salt : 54545454554545,
              verifier: 12345677894
          };

          const isValid =  service.detailsAreValid(body as any);

          expect(isValid).toEqual(true);

      })

})