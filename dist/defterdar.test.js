"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const defterdar_1 = require("./defterdar");
const testUtils_1 = require("./test/testUtils");
test("initializing or read repository for a given folder", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const newTestRepositoryFolder = yield testUtils_1.initNewRepositoryFolder("empty_test");
    const emptyResult = yield defterdar_1.getRepository(newTestRepositoryFolder);
    expect(emptyResult.gitDir.includes(".git")).toBe(true);
    expect(emptyResult.existing).toBe(false);
    const existingREsult = yield defterdar_1.getRepository(newTestRepositoryFolder);
    expect(existingREsult.gitDir.includes(".git")).toBe(true);
    expect(existingREsult.existing).toBe(true);
}));
test("can create commit", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const newTestRepositoryFolder = yield testUtils_1.initNewRepositoryFolder("create_commit_test");
    yield testUtils_1.replaceFileContent(`${newTestRepositoryFolder}/testFile`);
    const response = yield defterdar_1.createCommit(newTestRepositoryFolder, "test_commit");
    expect(response.branch).toBe("master");
    expect(response.commit).toBeDefined();
}));
test("can get commit history", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const newTestRepositoryFolder = yield testUtils_1.initNewRepositoryFolder("commit_history_test");
    yield testUtils_1.replaceFileContent(`${newTestRepositoryFolder}/testFile`);
    yield defterdar_1.createCommit(newTestRepositoryFolder, "test_commit");
    const singleCommitHistory = yield defterdar_1.getCommitHistory(newTestRepositoryFolder);
    expect(singleCommitHistory.all.length).toBe(1);
    yield testUtils_1.replaceFileContent(`${newTestRepositoryFolder}/testFile`);
    yield defterdar_1.createCommit(newTestRepositoryFolder, "test_commit");
    const doubleCommitHistory = yield defterdar_1.getCommitHistory(newTestRepositoryFolder);
    expect(doubleCommitHistory.all.length).toBe(2);
}));
test("can create commmit message", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const newTestRepositoryFolder = yield testUtils_1.initNewRepositoryFolder("commmit_message_test");
    yield testUtils_1.replaceFileContent(`${newTestRepositoryFolder}/testFile`);
    const result = yield defterdar_1.createCommitMessage(newTestRepositoryFolder);
    expect(result).toBe("{\"created\":[\"testFile\"],\"deleted\":[],\"modified\":[],\"renamed\":[]}");
}));
test("can create snapshot", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const newTestRepositoryFolder = yield testUtils_1.initNewRepositoryFolder("create_snapshot_test");
    yield testUtils_1.replaceFileContent(`${newTestRepositoryFolder}/testFile`);
    yield defterdar_1.createSnapshot(newTestRepositoryFolder, 10);
}));
test("can create archive", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const newTestRepositoryFolder = yield testUtils_1.initNewRepositoryFolder("create_archive");
    yield testUtils_1.createTestCommits(newTestRepositoryFolder, 10);
    yield defterdar_1.zipRepository(newTestRepositoryFolder, `defterdarExport-${Date.now()}.zip`);
    console.log("test");
}));
test("can create tag and read tags", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const newTestRepositoryFolder = yield testUtils_1.initNewRepositoryFolder("tag_commit");
    yield testUtils_1.createTestCommits(newTestRepositoryFolder, 10);
    const history = yield defterdar_1.getCommitHistory(newTestRepositoryFolder);
    const hashToTag = history.all[5].hash;
    yield defterdar_1.tagCommit(newTestRepositoryFolder, hashToTag, "Test Tag Message");
    const tags = yield defterdar_1.getTags(newTestRepositoryFolder);
    expect(tags.all.length).toBe(1);
}));
afterAll(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield testUtils_1.cleanRepositoriesFolder();
}));
