export interface WebPageDataSource {
    url: string;
}

export interface WebPageDataSourceList {
    [key: number]: WebPageDataSource;
}