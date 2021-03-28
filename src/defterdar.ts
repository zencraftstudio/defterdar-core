import simpleGit from "simple-git"
import {getGitExecutable} from "./util"

export enum CallbackType {
    initialization,
    snapshot_skipped,
    snapshot_taken,
    snapshot_tagged,
    snapshot_resumed,
    snapshot_timer_started,
    snapshot_timer_stopped
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

export const getHistoryVersions = (folderPath: string) => simpleGit(folderPath).branch()
export const createHistoryVersion = async (folderPath: string,
                                           commitHash: string,
                                           newHistoryName: string,
                                           queueNextSnapshot: boolean,
                                           nextSnapshotInSeconds: number,
                                           callback: CallableFunction) => {
    await createSnapshot(folderPath, queueNextSnapshot, nextSnapshotInSeconds, callback)
    return await getRepository(folderPath).checkout(commitHash, ["-b", newHistoryName]
    )
}
export const checkoutHistoryVersion = (folderPath: string, historyVersionName: string) => simpleGit(folderPath).checkout(historyVersionName)

export const createCommit = (
    folderPath: string,
    commitMessage: string,
    addFilter = ".",
) => getRepository(folderPath).add(addFilter).commit(commitMessage)

const calculateCompressableCommits = (folderPath: string, compressionRatio = 1) => {

}

export const tagSnapshot = (folderPath: string, commitHash: string, tagMessage: string) => (
    getRepository(folderPath).tag([`-m "${tagMessage}"`, commitHash])
)

export const getTags = (folderPath: string) => getRepository(folderPath).tags(["-n1"])

export const zipRepository = (folderPath: string, outputFilePath: string) => (
    getRepository(folderPath).raw("archive", "--format=zip", `--output=${outputFilePath}`, "master")
)
const backupRepository = (folderPath: string, username: string, password: string, repositoryPath: string) => {
}

export const createTaggedSnapshot = async (folderPath: string, tagMessage: string, callback: CallableFunction) => {
    const commitResult = await createSnapshot(folderPath, false, 0, callback)
    await tagSnapshot(folderPath, commitResult.commit, tagMessage)
    const tags = await getTags(folderPath)
    callback(CallbackType.snapshot_tagged, {"tagResults": tags, "timestamp": Date.now()})
    return tags
}

let nextSnapshotTimer: any = null
export const clearNextSnapshotTimer = () => (clearTimeout(nextSnapshotTimer))
export const createSnapshot = async (folderPath: string, queueNextSnapshot: boolean, nextSnapshotInSeconds: number, callback: CallableFunction) => {
    const commitMessage = await createCommitMessage(folderPath)
    const commitResult = await createCommit(folderPath, commitMessage)

    if (commitResult.commit) {
        callback(CallbackType.snapshot_taken, {"commitResult": commitResult, "timestamp": Date.now()})
    } else {
        callback(CallbackType.snapshot_skipped, {"commitResult": commitResult, "timestamp": Date.now()})
    }

    clearNextSnapshotTimer()
    if (queueNextSnapshot) {
        nextSnapshotTimer = setTimeout(() => createSnapshot(folderPath, queueNextSnapshot, nextSnapshotInSeconds * 1000, callback), nextSnapshotInSeconds * 1000)
        callback(CallbackType.snapshot_timer_started, {"nextSnapshotMiliseconds": nextSnapshotInSeconds * 1000})
    }
    return commitResult
}

export const startAutoSnapshotTimer = async (folderPath: string, intervalInSeconds: number, callback: CallableFunction) => {
    await createSnapshot(folderPath, true, intervalInSeconds, callback)
}
