import * as os from "os";
import getAppDataPath from "appdata-path";

import {promises as fsp} from "fs"
import fs from "fs"
import download from "./download";
import path from "path";

const unzipper = require("unzipper")


export const consoleLog = (message: string) => {
    console.log(message)
}

export const getOrDownloadGitExecutable = async () => {
    if (gitExecutableExists()) {
        return getGitExecutablePath()
    } else {
        await downloadGitBuild()
        return getGitExecutablePath()
    }
}

export const getGitDownloadUrl = async () => {
    const osArchInfo = getOsArchInfo()
    if (osArchInfo.platform === "darwin") {
        return `https://defterdar.s3.eu-central-1.amazonaws.com/installation/mac_git.zip`
    } else { /*(osArchInfo.platform === "win32")*/
        return `https://github.com/git-for-windows/git/releases/download/v2.31.0.windows.1/MinGit-2.31.0-${osArchInfo.arch}-bit.zip`
    }

}


export const downloadGitBuild = async () => {
    const downloadUrl = await getGitDownloadUrl();
    await cleanLibGitFolder()
    const appLibGitFolder = await getLibGitFolder()

    const result = await download(downloadUrl,appLibGitFolder, 'git.zip');

    const unzipperFile = await unzipper.Open.file(path.join(appLibGitFolder, "/git.zip"))
    await unzipperFile.extract({path: appLibGitFolder, concurrency: 5})
    await fsp.rm(path.join(appLibGitFolder, "/git.zip"))
    return path.join(appLibGitFolder, "git")

}

const cleanLibGitFolder = async () => {
    const gitLibFolder = `${getAppFolder()}/lib/`;
    await fsp.rmdir(gitLibFolder, {recursive: true});
    return gitLibFolder
}

const getLibGitFolder = async () => {
    const gitLibFolder = `${getAppFolder()}lib/`;
    await fsp.mkdir(gitLibFolder, {recursive: true});
    return gitLibFolder
}


const getAppFolder = () => {
    const appFolderPath = `${getAppDataPath(".defterdar-core/")}`
    fs.mkdirSync(appFolderPath, {recursive: true});
    return appFolderPath
}

export const gitExecutableExists = () => {
    const gitExecutablePath = getGitExecutablePath();
    // Folders are created, now check for executable.
    return fs.existsSync(gitExecutablePath);
}
export const getGitExecutablePath = () => {
    const appDataPath = getAppDataPath(".defterdar-core/");
    const osArchInfo = getOsArchInfo()
    let executablePath = "git/bin/git"
    if (osArchInfo.platform == "win32") {
        executablePath = "cmd/git.exe"
    }
    return `${appDataPath} / ${executablePath}`;
}

export const getOsArchInfo = () => {
    const osArchInfo = {
        "platform": os.platform().toString(),
        "arch": os.arch(),
        "release": parseInt(os.release()).toString()
    }
    return osArchInfo
}


const unzipAndDeleteGitBuild = async () => {

}
