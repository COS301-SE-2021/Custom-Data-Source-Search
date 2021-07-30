export interface FileDataSource {
    filename: string;
    path: string;
}

export interface StoredFileDataSource {
    uuid: string;
    filename: string;
    path: string;
    lastModified: Date;
}

export interface FileDataSourceList {
    [key: number]: StoredFileDataSource;
}