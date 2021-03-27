import {
    createHistoryVersion,
    createCommit, createCommitMessage,
    createSnapshot, createTaggedSnapshot,
    getCommitHistory, getHistoryVersions,
    getRepository, getTags, tagCommit, zipRepository, checkoutHistoryVersion,
} from "./defterdar"
import {cleanRepositoriesFolder, createTestCommits, initNewRepositoryFolder, replaceFileContent} from "./test/testUtils"
import * as fs from "fs";
import {folderExists} from "simple-git/src/lib/utils";

test("initializing or read repository for a given folder", async () => {
    const newTestRepositoryFolder = await initNewRepositoryFolder("empty_test")
    const emptyResult = await getRepository(newTestRepositoryFolder)
    expect(emptyResult.gitDir.includes(".git")).toBe(true)
    expect(emptyResult.existing).toBe(false)

    const existingREsult = await getRepository(newTestRepositoryFolder)
    expect(existingREsult.gitDir.includes(".git")).toBe(true)
    expect(existingREsult.existing).toBe(true)
})

test("can create commit", async () => {
    const newTestRepositoryFolder = await initNewRepositoryFolder("create_commit_test")
    await replaceFileContent(`${newTestRepositoryFolder}/testFile`)
    const response = await createCommit(newTestRepositoryFolder, "test_commit")
    expect(response.branch).toBe("master")
    expect(response.commit).toBeDefined()
})

test("can get commit history", async () => {
    const newTestRepositoryFolder = await initNewRepositoryFolder("commit_history_test")
    await replaceFileContent(`${newTestRepositoryFolder}/testFile`)
    await createCommit(newTestRepositoryFolder, "test_commit")
    const singleCommitHistory = await getCommitHistory(newTestRepositoryFolder)
    expect(singleCommitHistory.all.length).toBe(1)

    await replaceFileContent(`${newTestRepositoryFolder}/testFile`)
    await createCommit(newTestRepositoryFolder, "test_commit")
    const doubleCommitHistory = await getCommitHistory(newTestRepositoryFolder)
    expect(doubleCommitHistory.all.length).toBe(2)
})
test("can create commmit message", async () => {
    const newTestRepositoryFolder = await initNewRepositoryFolder("commmit_message_test")
    await replaceFileContent(`${newTestRepositoryFolder}/testFile`)
    const result = await createCommitMessage(newTestRepositoryFolder)
    expect(result).toBe("{\"created\":[\"testFile\"],\"deleted\":[],\"modified\":[],\"renamed\":[]}")
})

test("can create snapshot", async () => {
    const newTestRepositoryFolder = await initNewRepositoryFolder("create_snapshot_test")
    await replaceFileContent(`${newTestRepositoryFolder}/testFile`)
    await createSnapshot(newTestRepositoryFolder, true, 10, () => {
    })
})

test("can create archive", async () => {
    const newTestRepositoryFolder = await initNewRepositoryFolder("create_archive")
    await createTestCommits(newTestRepositoryFolder, 10)
    const outputFileName = `defterdarExport-${Date.now()}.zip`
    await zipRepository(newTestRepositoryFolder, outputFileName)
    const outputFileCheck = fs.existsSync(`${newTestRepositoryFolder}/${outputFileName}`)
    expect(outputFileCheck).toBe(true)
})

test("can create tag and read tags", async () => {
    const newTestRepositoryFolder = await initNewRepositoryFolder("tag_commit")
    await createTestCommits(newTestRepositoryFolder, 10)
    const history = await getCommitHistory(newTestRepositoryFolder)
    const hashToTag = history.all[5].hash
    await tagCommit(newTestRepositoryFolder, hashToTag, "Test Tag Message")
    const tags = await getTags(newTestRepositoryFolder)
    expect(tags.all.length).toBe(1)
})

test("can create tagged snapshot", async () => {
    const newTestRepositoryFolder = await initNewRepositoryFolder("tagged_snapshot")
    await replaceFileContent(`${newTestRepositoryFolder}/1`)
    const taggedSnapshotResult = await createTaggedSnapshot(newTestRepositoryFolder, "hello world", () => {
    })
    expect(taggedSnapshotResult.all.length).toBe(1)
});

test("can create list and checkout history versions", async () => {
    const newTestRepositoryFolder = await initNewRepositoryFolder("checkout_snapshot")
    await createTestCommits(newTestRepositoryFolder, 10)
    const history = await getCommitHistory(newTestRepositoryFolder)
    const checkoutResult = await createHistoryVersion(newTestRepositoryFolder, history.all[5].hash, "new_test_history")
    const checkedOutHistory = await getCommitHistory(newTestRepositoryFolder)
    const historyVersions = await getHistoryVersions(newTestRepositoryFolder)
    expect(checkedOutHistory.all.length).toBe(5)
    expect(historyVersions.all.length).toBe(2)
    const checkMainHistoryback = await checkoutHistoryVersion(newTestRepositoryFolder, "master")
    const mainHistory = await getCommitHistory(newTestRepositoryFolder)
    expect(mainHistory.all.length).toBe(10)
})

afterAll(async () => {
    await cleanRepositoriesFolder()
})
