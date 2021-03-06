export interface FileDataSource {
    filename: string;
    file: Buffer;
    path: string;
    tag1: string;
    tag2: string;
}

export interface StoredFileDataSource {
    uuid: string;
    filename: string;
    path: string;
    lastModified: Date;
    tag1: string;
    tag2: string;
}