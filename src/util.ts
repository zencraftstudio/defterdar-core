import * as os from "os";
import getAppDataPath from "appdata-path";
import {DownloadEndedStats, DownloaderHelper, Stats} from "node-downloader-helper"

const glob = require("glob")
import {promises as fsp} from "fs"
import fs from "fs"
import readdirRecursive from "./readDirRecursive";

const unzipper = require("unzipper")


export const consoleLog = (message: string) => {
    console.log(message)
}

const getOrDownloadGitExecutable = async () => {
    if (gitExecutableExists()) {
        return getGitExecutablePath()
    } else {
        await downloadGitBuild()
        return getGitExecutablePath()
    }
    return "test"
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
    // const zipfiles = await readdirRecursive(appFolder, (file: string) =>
    //     file.includes(".zip")
    // );

    // zipfiles.map(async (path) => {
    //     await fsp.rm(path)
    // });

    await cleanLibGitFolder()
    const appLibGitFolder = await getLibGitFolder()

    // const globArr = await glob(`${appFolder}*.zip`);
    // globArr.files.map(async (file: string) => (await fsp.rm(file)));
    const dl = new DownloaderHelper(downloadUrl, appLibGitFolder);


    const download = await dl.start();


    let test;
    dl.on('end', async (e: DownloadEndedStats) => {

        // fs.createReadStream(e.filePath).pipe(unzip.Extract({ path: 'output/path' }));
        const unzipperFile = await unzipper.Open.file(e.filePath)
        const unzipperResult = await unzipperFile.extract({path: appLibGitFolder, concurrency: 5})
        await fsp.rm(e.filePath)
        test = e.filePath
        // return e.filePath // Bu burda calismaz cunku icerdeki fonksyiondan donuyor.
        return test
    });
    dl.on('progress', (e: Stats) => {
        // TODO: Connect this to a callback. So the frontend can get progress.
        console.log(e)
    })



}

const cleanLibGitFolder = async () => {
    const gitLibFolder = `${getAppFolder()}/lib`;
    await fsp.rmdir(gitLibFolder, {recursive: true});
    return gitLibFolder
}

const getLibGitFolder = async () => {
    const gitLibFolder = `${getAppFolder()}/lib/git`;
    await fsp.mkdir(gitLibFolder, {recursive: true});
    return gitLibFolder
}


const getAppFolder = () => {
    const appFolderPath = `${getAppDataPath(".defterdar-core")}/`
    fs.mkdirSync(appFolderPath, {recursive: true});
    return appFolderPath
}

export const gitExecutableExists = () => {
    const gitExecutablePath = getGitExecutablePath();
    // Folders are created, now check for executable.
    return fs.existsSync(gitExecutablePath);
}
export const getGitExecutablePath = () => {
    const appDataPath = getAppDataPath(".defterdar-core");
    const osArchInfo = getOsArchInfo()
    let executablePath = "git/2.31.0/bin/git"
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
