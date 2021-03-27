import axios from "axios";

import {execSync} from "child_process"
import {mkdir, unlink} from "fs/promises";


export const downloadMacBinaries = async () => {
    const mac_versions_response = await axios.get("https://formulae.brew.sh/api/formula/git.json")
    const mac_versions_list = mac_versions_response.data['bottle']['stable']['files']
    for (const [mac_version, version_data] of Object.entries(mac_versions_list)) {
        const fileName = `ext/${mac_version}.tar.gz`
        const folderName = `ext/${mac_version}`
        // @ts-ignore
        const wgetResult = execSync(`wget -O ${fileName} ${version_data['url']}`)
        await mkdir(folderName)
        const unTarResult = execSync(`tar -xf ${fileName} -C ${folderName}`)
        await unlink(fileName)
    }

}

export const downloadWinBinaries = async () => {
    const filePrepend = "ext/win";
    [32, 64].map((arch: number) => {
        const filePath = `${filePrepend}_${arch}.zip`
        const wgetResult = execSync(`wget -O ${filePath} https://github.com/git-for-windows/git/releases/download/v2.31.0.windows.1/MinGit-2.31.0-${arch}-bit.zip`)
        const unzipResult = execSync(`unzip ${filePath} -d ${filePrepend}_${arch}`)
        unlink(filePath)
    });

}
