import * as os from "os";
import getAppDataPath from "appdata-path";

import fs from "fs"


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
