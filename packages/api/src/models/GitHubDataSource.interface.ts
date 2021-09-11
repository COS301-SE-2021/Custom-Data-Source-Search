export interface GitHubDataSource{
    repo: string;
    uuid: string;
    tag1: string;
    tag2: string;
    token: string;
}

export interface FileFromRepo{
    filePath: string;
    repoUUID: string;
    UUID: string;
}