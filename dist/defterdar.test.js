"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defterdar_1 = require("./defterdar");
const testUtils_1 = require("./test/testUtils");
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
    await defterdar_1.createSnapshot(newTestRepositoryFolder, 10);
});
test("can create archive", async () => {
    const newTestRepositoryFolder = await testUtils_1.initNewRepositoryFolder("create_archive");
    await testUtils_1.createTestCommits(newTestRepositoryFolder, 10);
    await defterdar_1.zipRepository(newTestRepositoryFolder, `defterdarExport-${Date.now()}.zip`);
    console.log("test");
});
test("can create tag and read tags", async () => {
    const newTestRepositoryFolder = await testUtils_1.initNewRepositoryFolder("tag_commit");
    await testUtils_1.createTestCommits(newTestRepositoryFolder, 10);
    const history = await defterdar_1.getCommitHistory(newTestRepositoryFolder);
    const hashToTag = history.all[5].hash;
    await defterdar_1.tagCommit(newTestRepositoryFolder, hashToTag, "Test Tag Message");
    const tags = await defterdar_1.getTags(newTestRepositoryFolder);
    expect(tags.all.length).toBe(1);
});
afterAll(async () => {
    await testUtils_1.cleanRepositoriesFolder();
});
