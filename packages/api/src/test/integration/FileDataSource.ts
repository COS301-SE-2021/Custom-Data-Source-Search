


// describe("File datasource", () => {
//     it("Get all file datasources endpoint should return status code of 200 and empty array when db is empty",
//         async () => {
//         const request = supertest(server)
//         jest.spyOn(fileDataSourceRepository, "getAllDataSources").mockImplementation(() => {
//             return [[], null];
//         });
//         const response = await request
//             .get('/filedatasources')
//             .set('Accept', 'application/json');
//         expect(response.status).toBe(200);
//         expect(response.body).toEqual([]);
//     });
// });