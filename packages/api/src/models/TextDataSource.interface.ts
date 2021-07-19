export interface TextDataSource {
    filename: string;
    path: string;
}

export interface StoredTextDataSource {
    uuid: string;
    filename: string;
    path: string;
    lastModified: Date;
}

export interface TextDataSourceList {
    [key: number]: StoredTextDataSource;
}