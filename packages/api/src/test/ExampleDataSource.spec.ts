
import ExampleDataSource from "../ExampleDataSource";

const testFilename = "example123.txt"

describe('Example Data Source' , () => {
    it('Should store the file name', () => {
        const exampleDataSource = new ExampleDataSource(testFilename)

        expect(testFilename).toEqual(exampleDataSource.getFileName());
    })
})