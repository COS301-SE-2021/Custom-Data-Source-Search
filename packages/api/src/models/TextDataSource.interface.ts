export interface TextDataSource {
    filename: string;
    path: string;
}

export interface TextDataSourceList {
    [key: number]: TextDataSource;
}