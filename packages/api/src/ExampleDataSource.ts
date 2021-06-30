 /**
 * @class ExampleDataSource
 */
export default class ExampleDataSource {

    filename: string;
    constructor (filename: string) {
        this.filename = filename;
    }

    getFileName(): string {
        return this.filename;
    }

}



