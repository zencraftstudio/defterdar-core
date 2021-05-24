"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOsArchInfo = exports.getGitExecutablePath = exports.gitExecutableExists = exports.downloadGitBuild = exports.getGitDownloadUrl = exports.consoleLog = void 0;
const tslib_1 = require("tslib");
const os = tslib_1.__importStar(require("os"));
const appdata_path_1 = tslib_1.__importDefault(require("appdata-path"));
const fs_1 = require("fs");
const fs_2 = tslib_1.__importDefault(require("fs"));
const download_1 = tslib_1.__importDefault(require("./download"));
const path_1 = tslib_1.__importDefault(require("path"));
const unzipper = require("unzipper");
const consoleLog = (message) => {
    console.log(message);
};
exports.consoleLog = consoleLog;
const getOrDownloadGitExecutable = async () => {
    if (exports.gitExecutableExists()) {
        return exports.getGitExecutablePath();
    }
    else {
        await exports.downloadGitBuild();
        return exports.getGitExecutablePath();
    }
    return "test";
};
const getGitDownloadUrl = async () => {
    const osArchInfo = exports.getOsArchInfo();
    if (osArchInfo.platform === "darwin") {
        return `https://defterdar.s3.eu-central-1.amazonaws.com/installation/mac_git.zip`;
    }
    else { /*(osArchInfo.platform === "win32")*/
        return `https://github.com/git-for-windows/git/releases/download/v2.31.0.windows.1/MinGit-2.31.0-${osArchInfo.arch}-bit.zip`;
    }
};
exports.getGitDownloadUrl = getGitDownloadUrl;
const downloadGitBuild = async () => {
    const downloadUrl = await exports.getGitDownloadUrl();
    await cleanLibGitFolder();
    const appLibGitFolder = await getLibGitFolder();
    const result = await download_1.default(downloadUrl, appLibGitFolder, 'git.zip');
    const unzipperFile = await unzipper.Open.file(path_1.default.join(appLibGitFolder, "/git.zip"));
    await unzipperFile.extract({ path: appLibGitFolder, concurrency: 5 });
    await fs_1.promises.rm(path_1.default.join(appLibGitFolder, "/git.zip"));
    return path_1.default.join(appLibGitFolder, "git");
};
exports.downloadGitBuild = downloadGitBuild;
const cleanLibGitFolder = async () => {
    const gitLibFolder = `${getAppFolder()}/lib/`;
    await fs_1.promises.rmdir(gitLibFolder, { recursive: true });
    return gitLibFolder;
};
const getLibGitFolder = async () => {
    const gitLibFolder = `${getAppFolder()}lib/`;
    await fs_1.promises.mkdir(gitLibFolder, { recursive: true });
    return gitLibFolder;
};
const getAppFolder = () => {
    const appFolderPath = `${appdata_path_1.default(".defterdar-core/")}`;
    fs_2.default.mkdirSync(appFolderPath, { recursive: true });
    return appFolderPath;
};
const gitExecutableExists = () => {
    const gitExecutablePath = exports.getGitExecutablePath();
    // Folders are created, now check for executable.
    return fs_2.default.existsSync(gitExecutablePath);
};
exports.gitExecutableExists = gitExecutableExists;
const getGitExecutablePath = () => {
    const appDataPath = appdata_path_1.default(".defterdar-core/");
    const osArchInfo = exports.getOsArchInfo();
    let executablePath = "git/bin/git";
    if (osArchInfo.platform == "win32") {
        executablePath = "cmd/git.exe";
    }
    return `${appDataPath} / ${executablePath}`;
};
exports.getGitExecutablePath = getGitExecutablePath;
const getOsArchInfo = () => {
    const osArchInfo = {
        "platform": os.platform().toString(),
        "arch": os.arch(),
        "release": parseInt(os.release()).toString()
    };
    return osArchInfo;
};
exports.getOsArchInfo = getOsArchInfo;
const unzipAndDeleteGitBuild = async () => {
};
