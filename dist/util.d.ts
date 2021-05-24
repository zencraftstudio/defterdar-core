export declare const consoleLog: (message: string) => void;
export declare const getGitDownloadUrl: () => Promise<string>;
export declare const downloadGitBuild: () => Promise<string>;
export declare const gitExecutableExists: () => boolean;
export declare const getGitExecutablePath: () => string;
export declare const getOsArchInfo: () => {
    platform: string;
    arch: string;
    release: string;
};
