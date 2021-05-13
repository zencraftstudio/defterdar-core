import * as os from "os";
import path from "path"

export const consoleLog = (message: string) => {
    console.log(message)
}

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
        },
        "ia32": {
            "all": "dist/git/win_32/cmd/git.exe"
        },
        "ia64": {
            "all": "dist/git/win_32/cmd/git.exe"
        }
    }
}
export const getGitExecutable = () => {
    const platform = os.platform().toString()
    // @ts-ignore
    const platform_gits = GIT_FOLDERS[platform]
    const arch = os.arch()
    // @ts-ignore
    const arch_gits = platform_gits[arch]
    const release = parseInt(os.release()).toString()

    if (platform === "win32") {
        return `${__dirname}/../${arch_gits["all"]}`;
    } else {
        return `${__dirname}/../${arch_gits[release]}`;
    }
}
