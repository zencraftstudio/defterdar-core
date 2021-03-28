export declare enum CallbackType {
    initialization = 0,
    snapshot_skipped = 1,
    snapshot_taken = 2,
    snapshot_tagged = 3,
    snapshot_resumed = 4,
    snapshot_timer_started = 5,
    snapshot_timer_stopped = 6
}
export declare const getRepository: (folderPath: string) => import("simple-git").Response<import("simple-git").InitResult>;
export declare const getCommitHistory: (folderPath: string) => import("simple-git").Response<import("simple-git").LogResult<import("simple-git").DefaultLogFields>>;
export declare const createCommitMessage: (folderPath: string) => Promise<string>;
export declare const getHistoryVersions: (folderPath: string) => import("simple-git").Response<import("simple-git").BranchSummary>;
export declare const createHistoryVersion: (folderPath: string, commitHash: string, newHistoryName: string, queueNextSnapshot: boolean, nextSnapshotInSeconds: number, callback: CallableFunction) => Promise<string>;
export declare const checkoutHistoryVersion: (folderPath: string, historyVersionName: string) => import("simple-git").Response<string>;
export declare const createCommit: (folderPath: string, commitMessage: string, addFilter?: string) => import("simple-git").Response<import("simple-git").CommitResult>;
export declare const tagSnapshot: (folderPath: string, commitHash: string, tagMessage: string) => import("simple-git").Response<string>;
export declare const getTags: (folderPath: string) => import("simple-git").Response<import("simple-git").TagResult>;
export declare const zipRepository: (folderPath: string, outputFilePath: string) => import("simple-git").Response<string>;
export declare const createTaggedSnapshot: (folderPath: string, tagMessage: string, callback: CallableFunction) => Promise<import("simple-git").TagResult>;
export declare const createSnapshot: (folderPath: string, queueNextSnapshot: boolean, nextSnapshotInSeconds: number, callback: CallableFunction) => Promise<import("simple-git").CommitResult>;
export declare const startAutoSnapshotTimer: (folderPath: string, intervalInSeconds: number, callback: CallableFunction) => Promise<void>;
