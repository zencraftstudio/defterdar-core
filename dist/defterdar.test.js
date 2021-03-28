"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const defterdar_1 = require("./defterdar");
const testUtils_1 = require("./test/testUtils");
const fs = tslib_1.__importStar(require("fs"));
beforeAll(async () => {
    await testUtils_1.cleanRepositoriesFolder();
});
test("initializing or read repository for a given folder", async () => {
    const newTestRepositoryFolder = await testUtils_1.initNewRepositoryFolder("empty_test");
    const emptyResult = await defterdar_1.getRepository(newTestRepositoryFolder);
    expect(emptyResult.gitDir.includes(".git")).toBe(true);
    expect(emptyResult.existing).toBe(false);
    const existingREsult = await defterdar_1.getRepository(newTestRepositoryFolder);
    expect(existingREsult.gitDir.includes(".git")).toBe(true);
    expect(existingREsult.existing).toBe(true);
});
test("can create commit", async () => {
    const newTestRepositoryFolder = await testUtils_1.initNewRepositoryFolder("create_commit_test");
    await testUtils_1.replaceFileContent(`${newTestRepositoryFolder}/testFile`);
    const response = await defterdar_1.createCommit(newTestRepositoryFolder, "test_commit");
    expect(response.branch).toBe("master");
    expect(response.commit).toBeDefined();
});
test("can get commit history", async () => {
    const newTestRepositoryFolder = await testUtils_1.initNewRepositoryFolder("commit_history_test");
    await testUtils_1.replaceFileContent(`${newTestRepositoryFolder}/testFile`);
    await defterdar_1.createCommit(newTestRepositoryFolder, "test_commit");
    const singleCommitHistory = await defterdar_1.getCommitHistory(newTestRepositoryFolder);
    expect(singleCommitHistory.all.length).toBe(1);
    await testUtils_1.replaceFileContent(`${newTestRepositoryFolder}/testFile`);
    await defterdar_1.createCommit(newTestRepositoryFolder, "test_commit");
    const doubleCommitHistory = await defterdar_1.getCommitHistory(newTestRepositoryFolder);
    expect(doubleCommitHistory.all.length).toBe(2);
});
test("can create commmit message", async () => {
    const newTestRepositoryFolder = await testUtils_1.initNewRepositoryFolder("commmit_message_test");
    await testUtils_1.replaceFileContent(`${newTestRepositoryFolder}/testFile`);
    const result = await defterdar_1.createCommitMessage(newTestRepositoryFolder);
    expect(result).toBe("{\"created\":[\"testFile\"],\"deleted\":[],\"modified\":[],\"renamed\":[]}");
});
test("can create snapshot", async () => {
    const newTestRepositoryFolder = await testUtils_1.initNewRepositoryFolder("create_snapshot_test");
    await testUtils_1.replaceFileContent(`${newTestRepositoryFolder}/testFile`);
    await defterdar_1.createSnapshot(newTestRepositoryFolder, true, 10, () => {
    });
});
defterdar_1.createSnapshot("/Users/gokaykucuk/temp/tempRepo", true, 10, () => {
});
test("can create archive", async () => {
    const newTestRepositoryFolder = await testUtils_1.initNewRepositoryFolder("create_archive");
    await testUtils_1.createTestCommits(newTestRepositoryFolder, 10);
    const outputFileName = `defterdarExport-${Date.now()}.zip`;
    await defterdar_1.zipRepository(newTestRepositoryFolder, outputFileName);
    const outputFileCheck = fs.existsSync(`${newTestRepositoryFolder}/${outputFileName}`);
    expect(outputFileCheck).toBe(true);
});
test("can create tag and read tags", async () => {
    const newTestRepositoryFolder = await testUtils_1.initNewRepositoryFolder("tag_commit");
    await testUtils_1.createTestCommits(newTestRepositoryFolder, 10);
    const history = await defterdar_1.getCommitHistory(newTestRepositoryFolder);
    const hashToTag = history.all[5].hash;
    await defterdar_1.tagSnapshot(newTestRepositoryFolder, hashToTag, "Test Tag Message");
    const tags = await defterdar_1.getTags(newTestRepositoryFolder);
    expect(tags.all.length).toBe(1);
});
test("can create tagged snapshot", async () => {
    const newTestRepositoryFolder = await testUtils_1.initNewRepositoryFolder("tagged_snapshot");
    await testUtils_1.replaceFileContent(`${newTestRepositoryFolder}/1`);
    const taggedSnapshotResult = await defterdar_1.createTaggedSnapshot(newTestRepositoryFolder, "hello world", () => {
    });
    expect(taggedSnapshotResult.all.length).toBe(1);
});
test("can create list and checkout history versions", async () => {
    const newTestRepositoryFolder = await testUtils_1.initNewRepositoryFolder("checkout_snapshot");
    await testUtils_1.createTestCommits(newTestRepositoryFolder, 10);
    const history = await defterdar_1.getCommitHistory(newTestRepositoryFolder);
    const checkoutResult = await defterdar_1.createHistoryVersion(newTestRepositoryFolder, history.all[5].hash, "new_test_history", false, 0, () => {
    });
    const checkedOutHistory = await defterdar_1.getCommitHistory(newTestRepositoryFolder);
    const historyVersions = await defterdar_1.getHistoryVersions(newTestRepositoryFolder);
    expect(checkedOutHistory.all.length).toBe(5);
    expect(historyVersions.all.length).toBe(2);
    const checkMainHistoryback = await defterdar_1.checkoutHistoryVersion(newTestRepositoryFolder, "master");
    const mainHistory = await defterdar_1.getCommitHistory(newTestRepositoryFolder);
    expect(mainHistory.all.length).toBe(10);
});
afterAll(async () => {
    await testUtils_1.cleanRepositoriesFolder();
});
