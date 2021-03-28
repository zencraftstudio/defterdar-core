"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSnapshot = exports.createTaggedSnapshot = exports.zipRepository = exports.getTags = exports.tagSnapshot = exports.createCommit = exports.checkoutHistoryVersion = exports.createHistoryVersion = exports.getHistoryVersions = exports.createCommitMessage = exports.getCommitHistory = exports.getRepository = exports.CallbackType = void 0;
const tslib_1 = require("tslib");
const simple_git_1 = tslib_1.__importDefault(require("simple-git"));
const util_1 = require("./util");
var CallbackType;
(function (CallbackType) {
    CallbackType[CallbackType["initialization"] = 0] = "initialization";
    CallbackType[CallbackType["snapshot_skipped"] = 1] = "snapshot_skipped";
    CallbackType[CallbackType["snapshot_taken"] = 2] = "snapshot_taken";
    CallbackType[CallbackType["snapshot_tagged"] = 3] = "snapshot_tagged";
    CallbackType[CallbackType["snapshot_resumed"] = 4] = "snapshot_resumed";
    CallbackType[CallbackType["snapshot_timer_started"] = 5] = "snapshot_timer_started";
    CallbackType[CallbackType["snapshot_timer_stopped"] = 6] = "snapshot_timer_stopped";
})(CallbackType = exports.CallbackType || (exports.CallbackType = {}));
const getRepository = (folderPath) => simple_git_1.default(folderPath, { binary: util_1.getGitExecutable() }).init();
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
const getHistoryVersions = (folderPath) => simple_git_1.default(folderPath).branch();
exports.getHistoryVersions = getHistoryVersions;
const createHistoryVersion = async (folderPath, commitHash, newHistoryName, queueNextSnapshot, nextSnapshotInSeconds, callback) => {
    await exports.createSnapshot(folderPath, queueNextSnapshot, nextSnapshotInSeconds, callback);
    return await exports.getRepository(folderPath).checkout(commitHash, ["-b", newHistoryName]);
};
exports.createHistoryVersion = createHistoryVersion;
const checkoutHistoryVersion = (folderPath, historyVersionName) => simple_git_1.default(folderPath).checkout(historyVersionName);
exports.checkoutHistoryVersion = checkoutHistoryVersion;
const createCommit = (folderPath, commitMessage, addFilter = ".") => exports.getRepository(folderPath).add(addFilter).commit(commitMessage);
exports.createCommit = createCommit;
const calculateCompressableCommits = (folderPath, compressionRatio = 1) => {
};
const tagSnapshot = (folderPath, commitHash, tagMessage) => (exports.getRepository(folderPath).tag([`-m "${tagMessage}"`, commitHash]));
exports.tagSnapshot = tagSnapshot;
const getTags = (folderPath) => exports.getRepository(folderPath).tags(["-n1"]);
exports.getTags = getTags;
const zipRepository = (folderPath, outputFilePath) => (exports.getRepository(folderPath).raw("archive", "--format=zip", `--output=${outputFilePath}`, "master"));
exports.zipRepository = zipRepository;
const backupRepository = (folderPath, username, password, repositoryPath) => {
};
const createTaggedSnapshot = async (folderPath, tagMessage, callback) => {
    const commitResult = await exports.createSnapshot(folderPath, false, 0, callback);
    await exports.tagSnapshot(folderPath, commitResult.commit, tagMessage);
    const tags = await exports.getTags(folderPath);
    callback(CallbackType.snapshot_tagged, { "tagResults": tags, "timestamp": Date.now() });
    return tags;
};
exports.createTaggedSnapshot = createTaggedSnapshot;
let nextSnapshotTimer = null;
const createSnapshot = async (folderPath, queueNextSnapshot, nextSnapshotInSeconds, callback) => {
    // Start with clearing timeout, so no other snapshots
    // can start while this one is running
    clearTimeout(nextSnapshotTimer);
    const commitMessage = await exports.createCommitMessage(folderPath);
    const commitResult = await exports.createCommit(folderPath, commitMessage);
    if (commitResult.commit) {
        callback(CallbackType.snapshot_taken, { "commitResult": commitResult, "timestamp": Date.now() });
    }
    else {
        callback(CallbackType.snapshot_skipped, { "commitResult": commitResult, "timestamp": Date.now() });
    }
    // Queue the next snapshot if it's requested.
    if (queueNextSnapshot) {
        nextSnapshotTimer = setTimeout(() => exports.createSnapshot(folderPath, queueNextSnapshot, nextSnapshotInSeconds * 1000, callback), nextSnapshotInSeconds * 1000);
        callback(CallbackType.snapshot_timer_started, {
            "nextSnapshotMiliseconds": nextSnapshotInSeconds * 1000,
            "timestamp": Date.now()
        });
    }
    return commitResult;
};
exports.createSnapshot = createSnapshot;
