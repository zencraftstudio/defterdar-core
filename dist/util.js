"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitExecutable = exports.consoleLog = void 0;
const tslib_1 = require("tslib");
const os = tslib_1.__importStar(require("os"));
const consoleLog = (message) => {
    console.log(message);
};
exports.consoleLog = consoleLog;
const GIT_FOLDERS = {
    "darwin": {
        "x64": {
            "18": "dist/git/mojave/git/2.31.0/bin/git",
            "19": "dist/git/catalina/git/2.31.0/bin/git",
            "20": "dist/git/big_sur/git/2.31.0/bin/git"
        },
        "arm": {
            "20": "dist/git/arm64_big_sur/git/2.31.0/bin/git"
        }
    },
    "win32": {
        "x64": {
            "all": "dist/git/win_64/cmd/git.exe"
        },
        "x32": {
            "all": "dist/git/win_32/cmd/git.exe"
        }
    }
};
const getGitExecutable = () => {
    return `${__dirname}/../${GIT_FOLDERS["darwin"]["x64"]["19"]}`;
    const platform = os.platform().toString();
    // @ts-ignore
    const platform_gits = GIT_FOLDERS[platform];
    const arch = os.arch();
    // @ts-ignore
    const arch_gits = platform_gits[arch];
    const release = parseInt(os.release()).toString();
    if (platform === "win_32") {
        return `${__dirname}/../${arch_gits["all"]}`;
    }
    else {
        return `${__dirname}/../${arch_gits[release]}`;
    }
};
exports.getGitExecutable = getGitExecutable;
