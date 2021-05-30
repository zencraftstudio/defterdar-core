import download from "./download";
import {promises as fsp} from "fs";
import {getAppFolder, getOsArchInfo} from "./util";
import * as fs from "fs";
import * as path from "path";
import {ExecException} from "child_process";

const gitInstallationFolder = "defterdarGit"
const { exec } = require("child_process");


export const getGitDownloadUrl = () => {
    const osArchInfo = getOsArchInfo()
    if (osArchInfo.platform === "darwin") {
        return `https://defterdar.s3.eu-central-1.amazonaws.com/installation/mac_32.tar.gz`
    } else { /*(osArchInfo.platform === "win32")*/
        return `https://defterdar.s3.eu-central-1.amazonaws.com/installation/win_32.tar.gz`
    }

}

// Call after checking
export const setupGit = async () => {
    const fileName = "download.tar.gz"
    const gitDownloadUrl = getGitDownloadUrl()
    const downloadPath = `${getAppFolder()}`
    await download(gitDownloadUrl, downloadPath, fileName)
    await unzipAndDeleteFile(`${getAppFolder()}/${fileName}`, downloadPath)
}

export const unzipAndDeleteFile = async (filePath: string, unzipFolderPath: string) => {
    exec(`tar -xf ${filePath} -C ${unzipFolderPath}`, async (error: ExecException | null, stdout:string , stderr: string) => {
        await fsp.rm(path.join(filePath))
        return unzipFolderPath
    })
    // const unzipperFile = await unzipper.Open.file(filePath)
    // await unzipperFile.extract({path: unzipFolderPath, concurrency: 5})
}

export const isGitInstalled = () => {
    const gitExecutablePath = getGitExecutablePath();
    // Folders are created, now check for executable.
    return fs.existsSync(gitExecutablePath);
}
export const getGitExecutablePath = () => {
    const appDataPath = getAppFolder();
    const osArchInfo = getOsArchInfo()
    let executablePath = "git/bin/git"
    if (osArchInfo.platform == "win32") {
        executablePath = "git/cmd/git.exe"
    }
    return `${appDataPath}/${executablePath}`;
}


const cleanFolder = async (local_folder_path: string) => {
    await fsp.rmdir(local_folder_path, {recursive: true});
    return local_folder_path
}
