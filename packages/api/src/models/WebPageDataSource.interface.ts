export interface WebPageDataSource {
    uuid: string;
    url: string;
}

export interface WebPageDataSourceList {
    [key: number]: WebPageDataSource;
}