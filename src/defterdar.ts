import simpleGit from "simple-git"
import {consoleLog} from "./util"

export const getRepository = (folderPath: string) => simpleGit(folderPath).init()

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

export const createSnapshot = async (folderPath: string, nextSnapshotAt: number) => {
    const commitMessage = await createCommitMessage(folderPath)
    const commitResponse = await createCommit(folderPath, commitMessage)
    if (commitResponse.commit) {
        consoleLog(`Created snapshot ${commitResponse.commit} at ${new Date().toJSON()}`)
    } else {
        consoleLog(`No changes at ${new Date().toJSON()}. Skipping snapshot...`)
    }
    setInterval(() => createSnapshot(folderPath, nextSnapshotAt * 1000), nextSnapshotAt * 1000)
}

export const initializeDefterdar = async (folderPath: string, intervalInSeconds: number) => {
    await createSnapshot(folderPath, intervalInSeconds)
}
