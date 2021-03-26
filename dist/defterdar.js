import { __rest } from "tslib";
import simpleGit from "simple-git";
import { consoleLog } from "./util";
export const getRepository = (folderPath) => simpleGit(folderPath).init();
export const getCommitHistory = (folderPath) => (getRepository(folderPath).log());
const getStatus = (folderPath) => getRepository(folderPath).add(".").status();
export const createCommitMessage = async (folderPath) => {
    const repoStatus = await getStatus(folderPath);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { not_added, files, staged, ahead, behind, current, tracking, conflicted } = repoStatus, relevantKeys = __rest(repoStatus
    // flatten the message array
    , ["not_added", "files", "staged", "ahead", "behind", "current", "tracking", "conflicted"]);
    // flatten the message array
    return JSON.stringify(relevantKeys);
};
export const createCommit = (folderPath, commitMessage, addFilter = ".") => getRepository(folderPath).add(addFilter).commit(commitMessage);
const calculateCompressableCommits = (folderPath, compressionRatio = 1) => {
};
export const tagCommit = (folderPath, commitHash, tagMessage) => {
    getRepository(folderPath).tag([`-m "${tagMessage}"`, commitHash]);
};
export const getTags = (folderPath) => getRepository(folderPath).tags(["-n1"]);
export const zipRepository = (folderPath, outputFilePath) => {
    getRepository(folderPath).raw("archive", "--format=zip", `--output=${outputFilePath}`, "master");
};
const backupRepository = (folderPath, username, password, repositoryPath) => {
};
export const createSnapshot = async (folderPath, nextSnapshotAt) => {
    const commitMessage = await createCommitMessage(folderPath);
    const commitResponse = await createCommit(folderPath, commitMessage);
    if (commitResponse.commit) {
        consoleLog(`Created snapshot ${commitResponse.commit} at ${new Date().toJSON()}`);
    }
    else {
        consoleLog(`No changes at ${new Date().toJSON()}. Skipping snapshot...`);
    }
    setInterval(() => createSnapshot(folderPath, nextSnapshotAt * 1000), nextSnapshotAt * 1000);
};
export const initializeDefterdar = async (folderPath, intervalInSeconds) => {
    await createSnapshot(folderPath, intervalInSeconds);
};
