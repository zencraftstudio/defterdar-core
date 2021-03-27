"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDefterdar = exports.createSnapshot = exports.zipRepository = exports.getTags = exports.tagCommit = exports.createCommit = exports.createCommitMessage = exports.getCommitHistory = exports.getRepository = void 0;
const tslib_1 = require("tslib");
const simple_git_1 = tslib_1.__importDefault(require("simple-git"));
const util_1 = require("./util");
const getRepository = (folderPath) => simple_git_1.default(folderPath).init();
exports.getRepository = getRepository;
const getCommitHistory = (folderPath) => (exports.getRepository(folderPath).log());
exports.getCommitHistory = getCommitHistory;
const getStatus = (folderPath) => exports.getRepository(folderPath).add(".").status();
const createCommitMessage = async (folderPath) => {
    const repoStatus = await getStatus(folderPath);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { not_added, files, staged, ahead, behind, current, tracking, conflicted, ...relevantKeys } = repoStatus;
    // flatten the message array
    return JSON.stringify(relevantKeys);
};
exports.createCommitMessage = createCommitMessage;
const createCommit = (folderPath, commitMessage, addFilter = ".") => exports.getRepository(folderPath).add(addFilter).commit(commitMessage);
exports.createCommit = createCommit;
const calculateCompressableCommits = (folderPath, compressionRatio = 1) => {
};
const tagCommit = (folderPath, commitHash, tagMessage) => {
    exports.getRepository(folderPath).tag([`-m "${tagMessage}"`, commitHash]);
};
exports.tagCommit = tagCommit;
const getTags = (folderPath) => exports.getRepository(folderPath).tags(["-n1"]);
exports.getTags = getTags;
const zipRepository = (folderPath, outputFilePath) => {
    exports.getRepository(folderPath).raw("archive", "--format=zip", `--output=${outputFilePath}`, "master");
};
exports.zipRepository = zipRepository;
const backupRepository = (folderPath, username, password, repositoryPath) => {
};
const createSnapshot = async (folderPath, nextSnapshotAt) => {
    const commitMessage = await exports.createCommitMessage(folderPath);
    const commitResponse = await exports.createCommit(folderPath, commitMessage);
    if (commitResponse.commit) {
        util_1.consoleLog(`Created snapshot ${commitResponse.commit} at ${new Date().toJSON()}`);
    }
    else {
        util_1.consoleLog(`No changes at ${new Date().toJSON()}. Skipping snapshot...`);
    }
    setInterval(() => exports.createSnapshot(folderPath, nextSnapshotAt * 1000), nextSnapshotAt * 1000);
};
exports.createSnapshot = createSnapshot;
const initializeDefterdar = async (folderPath, intervalInSeconds) => {
    await exports.createSnapshot(folderPath, intervalInSeconds);
};
exports.initializeDefterdar = initializeDefterdar;
