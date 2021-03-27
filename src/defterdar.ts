import simpleGit from "simple-git"
import {getGitExecutable} from "./util"

export enum CallbackType {
    initialization = 0,
    snapshot_skipped = 1,
    snapshot_taken = 2,
}

export const getRepository = (folderPath: string) => simpleGit(folderPath, {binary: getGitExecutable()}).init()

export const getCommitHistory = (folderPath: string) => (
    getRepository(folderPath).log()
)

const getStatus = (folderPath: string) => getRepository(folderPath).add(".").status()

export const createCommitMessage = async (folderPath: string) => {
    const repoStatus = await getStatus(folderPath)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {not_added, files, staged, ahead, behind, current, tracking, conflicted, ...relevantKeys} = repoStatus
    // flatten the message array
    return JSON.stringify(relevantKeys)
}

export const createCommit = (
    folderPath: string,
    commitMessage: string,
    addFilter = ".",
) => getRepository(folderPath).add(addFilter).commit(commitMessage)

const calculateCompressableCommits = (folderPath: string, compressionRatio = 1) => {

}

export const tagCommit = (folderPath: string, commitHash: string, tagMessage: string) => {
    getRepository(folderPath).tag([`-m "${tagMessage}"`, commitHash])
}

export const getTags = (folderPath: string) => getRepository(folderPath).tags(["-n1"])

export const zipRepository = (folderPath: string, outputFilePath: string) => {
    getRepository(folderPath).raw("archive", "--format=zip", `--output=${outputFilePath}`, "master")
}
const backupRepository = (folderPath: string, username: string, password: string, repositoryPath: string) => {
}

export const createSnapshot = async (folderPath: string, nextSnapshotAt: number, callback: CallableFunction) => {
    const commitMessage = await createCommitMessage(folderPath)
    const commitResponse = await createCommit(folderPath, commitMessage)
    if (commitResponse.commit) {
        callback(CallbackType.snapshot_taken, {"commit_response": commitResponse, "timestamp": Date.now()})
    } else {
        callback(CallbackType.snapshot_skipped, {"commit_response": commitResponse, "timestamp": Date.now()})
    }
    setInterval(() => createSnapshot(folderPath, nextSnapshotAt * 1000, callback), nextSnapshotAt * 1000)
}

export const initializeDefterdar = async (folderPath: string, intervalInSeconds: number, callback: CallableFunction) => {
    await createSnapshot(folderPath, intervalInSeconds, callback)
}
