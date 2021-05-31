import {getGitDownloadUrl, getGitExecutablePath, isGitInstalled, removeInstalledGit, setupGit} from "./git";

const TEMP_FOLDER = `${process.cwd()}/tmp`;
const FIXTURES_FOLDER = `${process.cwd()}/test/fixtures`;

test("can get git executable path", () => {
    const gitExecutable = getGitExecutablePath();
    expect(gitExecutable).toBeDefined();
});

test("can get download url", async () => {
    const downloadUrl = await getGitDownloadUrl();
    expect(downloadUrl).toBeDefined();
});

test("setup git", async () => {
    const removeGitResult = await removeInstalledGit()
    const gitExecutableDoesntExist = isGitInstalled()
    expect(gitExecutableDoesntExist).toBeFalsy()
    const setupGitResponse = await setupGit()
    const gitExecutableExists = isGitInstalled()
    expect(gitExecutableExists).toBeTruthy()
});
