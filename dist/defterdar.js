"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDefterdar = exports.createSnapshot = exports.zipRepository = exports.getTags = exports.tagCommit = exports.createCommit = exports.createCommitMessage = exports.getCommitHistory = exports.getRepository = exports.CallbackType = void 0;
const tslib_1 = require("tslib");
const simple_git_1 = tslib_1.__importDefault(require("simple-git"));
var CallbackType;
(function (CallbackType) {
    CallbackType[CallbackType["initialization"] = 0] = "initialization";
    CallbackType[CallbackType["snapshot_skipped"] = 1] = "snapshot_skipped";
    CallbackType[CallbackType["snapshot_taken"] = 2] = "snapshot_taken";
})(CallbackType = exports.CallbackType || (exports.CallbackType = {}));
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
const createSnapshot = async (folderPath, nextSnapshotAt, callback) => {
    const commitMessage = await exports.createCommitMessage(folderPath);
    const commitResponse = await exports.createCommit(folderPath, commitMessage);
    if (commitResponse.commit) {
        callback(CallbackType.snapshot_taken, { "commit_response": commitResponse, "timestamp": (new Date().toJSON()) });
    }
    else {
        callback(CallbackType.snapshot_skipped, { "commit_response": commitResponse, "timestamp": (new Date().toJSON()) });
    }
    setInterval(() => exports.createSnapshot(folderPath, nextSnapshotAt * 1000, callback), nextSnapshotAt * 1000);
};
exports.createSnapshot = createSnapshot;
const initializeDefterdar = async (folderPath, intervalInSeconds, callback) => {
    await exports.createSnapshot(folderPath, intervalInSeconds, callback);
};
exports.initializeDefterdar = initializeDefterdar;
