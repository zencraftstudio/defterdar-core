"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadWinBinaries = exports.downloadMacBinaries = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const child_process_1 = require("child_process");
const promises_1 = require("fs/promises");
const downloadMacBinaries = async () => {
    const mac_versions_response = await axios_1.default.get("https://formulae.brew.sh/api/formula/git.json");
    const mac_versions_list = mac_versions_response.data['bottle']['stable']['files'];
    for (const [mac_version, version_data] of Object.entries(mac_versions_list)) {
        const fileName = `dist/git/${mac_version}.tar.gz`;
        const folderName = `dist/git/${mac_version}`;
        // @ts-ignore
        const wgetResult = child_process_1.execSync(`wget -O ${fileName} ${version_data['url']}`);
        await promises_1.mkdir(folderName);
        const unTarResult = child_process_1.execSync(`tar -xf ${fileName} -C ${folderName}`);
        await promises_1.unlink(fileName);
    }
};
exports.downloadMacBinaries = downloadMacBinaries;
const downloadWinBinaries = async () => {
    const filePrepend = "dist/git/win";
    [32, 64].map((arch) => {
        const filePath = `${filePrepend}_${arch}.zip`;
        const wgetResult = child_process_1.execSync(`wget -O ${filePath} https://github.com/git-for-windows/git/releases/download/v2.31.0.windows.1/MinGit-2.31.0-${arch}-bit.zip`);
        const unzipResult = child_process_1.execSync(`unzip ${filePath} -d ${filePrepend}_${arch}`);
        promises_1.unlink(filePath);
    });
};
exports.downloadWinBinaries = downloadWinBinaries;
