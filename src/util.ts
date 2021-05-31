import * as os from "os";
import getAppDataPath from "appdata-path";

import fs from "fs"
import {ExecException} from "child_process";


export const consoleLog = (message: string) => {
    console.log(message)
}

export const getAppFolder = () => {
    const appFolderPath = `${getAppDataPath("defterdarCore")}`
    fs.mkdirSync(appFolderPath, {recursive: true});
    return appFolderPath
}


export const getOsArchInfo = () => {
    const osArchInfo = {
        "platform": os.platform().toString(),
        "arch": os.arch(),
        "release": parseInt(os.release()).toString()
    }
    return osArchInfo
}


/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
export const execShellCommand = async (cmd: string) => {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
        exec(cmd, (error: ExecException | null, stdout: string, stderr: string) => {
            if (error) {
                console.warn(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}
