export declare const initNewRepositoryFolder: (folderName: string) => Promise<string>;
export declare const cleanRepositoriesFolder: () => Promise<void>;
export declare const replaceFileContent: (filePath: string) => Promise<void>;
export declare const createTestCommits: (folderPath: string, numberOfCommits: number) => Promise<void>;
