export interface FolderDataSource {
    path: string;
    tag1: string;
    tag2: string;
    dotIgnore: string;
    depth: number;
}

export interface StoredFolderDataSource {
    uuid: string;
    path: string;
    tag1: string;
    tag2: string;
    dotIgnore: string;
}

export interface FileInFolder {
    filePath: string;
    lastModified: Date;
    folderUUID: string;
    UUID: string;
}