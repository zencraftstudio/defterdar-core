import {
    createCommit, createCommitMessage,
    createSnapshot,
    getCommitHistory,
    getRepository, getTags, tagCommit, zipRepository,
} from "./defterdar"
import {cleanRepositoriesFolder, createTestCommits, initNewRepositoryFolder, replaceFileContent} from "./test/testUtils"

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
    await createSnapshot(newTestRepositoryFolder, 10)
})

test("can create archive", async () => {
    const newTestRepositoryFolder = await initNewRepositoryFolder("create_archive")
    await createTestCommits(newTestRepositoryFolder, 10)
    await zipRepository(newTestRepositoryFolder, `defterdarExport-${Date.now()}.zip`)
    console.log("test")
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

afterAll(async () => {
    await cleanRepositoriesFolder()
})
