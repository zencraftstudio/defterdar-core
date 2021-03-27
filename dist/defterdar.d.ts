export declare enum CallbackType {
    initialization = 0,
    snapshot_skipped = 1,
    snapshot_taken = 2
}
export declare const getRepository: (folderPath: string) => import("simple-git").Response<import("simple-git").InitResult>;
export declare const getCommitHistory: (folderPath: string) => import("simple-git").Response<import("simple-git").LogResult<import("simple-git").DefaultLogFields>>;
export declare const createCommitMessage: (folderPath: string) => Promise<string>;
export declare const createCommit: (folderPath: string, commitMessage: string, addFilter?: string) => import("simple-git").Response<import("simple-git").CommitResult>;
export declare const tagCommit: (folderPath: string, commitHash: string, tagMessage: string) => void;
export declare const getTags: (folderPath: string) => import("simple-git").Response<import("simple-git").TagResult>;
export declare const zipRepository: (folderPath: string, outputFilePath: string) => void;
export declare const createSnapshot: (folderPath: string, nextSnapshotAt: number, callback: CallableFunction) => Promise<void>;
export declare const initializeDefterdar: (folderPath: string, intervalInSeconds: number, callback: CallableFunction) => Promise<void>;
