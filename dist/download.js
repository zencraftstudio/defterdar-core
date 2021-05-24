"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const download = (url, dirPath, fileName) => {
    try {
        if (!dirPath) {
            throw new Error("You need to pass dir path.");
        }
        if (!fs_1.default.lstatSync(dirPath).isDirectory()) {
            throw new Error(`${dirPath}, is not a directory.`);
        }
        const filePath = dirPath + fileName;
        const protocol = url.includes('https') ? 'https' : 'http';
        return new Promise((resolve, reject) => {
            let fileInfo = null;
            const request = require(protocol).get(url, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                    return;
                }
                if ("headers" in response) {
                    const file = fs_1.default.createWriteStream(filePath);
                    fileInfo = {
                        name: fileName,
                        path: filePath ? filePath : `${dirPath}${fileName}`,
                        mime: response.headers['content-type'],
                        size: parseInt(response.headers['content-length'], 10)
                    };
                    response.pipe(file);
                    file.on('finish', () => resolve(fileInfo));
                    file.on('error', err => {
                        fs_1.default.unlink(filePath, () => reject(err));
                    });
                }
                else {
                    reject(new Error(`Headers not found in response: ${url}`));
                    return;
                }
            });
            request.on('error', (err) => {
                fs_1.default.unlink(filePath, () => reject(err));
            });
            request.end();
        });
    }
    catch (e) {
        console.error(e);
        return;
    }
};
exports.default = download;
