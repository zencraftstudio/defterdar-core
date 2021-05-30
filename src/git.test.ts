import {getGitDownloadUrl, getGitExecutablePath, isGitInstalled, setupGit} from "./git";
import fs from "fs";

const TEMP_FOLDER = `${process.cwd()}/tmp`;
const FIXTURES_FOLDER = `${process.cwd()}/test/fixtures`;

test("can get git executable path", () => {
    const gitExecutable = getGitExecutablePath();
    expect(gitExecutable).toBeDefined();
});

// test("download git build", async ()=>{
//     const gitBuild = await downloadGitBuild()
//     expect(gitBuild).toBeTruthy()
// }, 15000)



test("can get download url", async () => {
    const downloadUrl = await getGitDownloadUrl();
    expect(downloadUrl).toBeDefined();
});


// test("unzipFile", async () => {
//     const unzipFolderPath = `${TEMP_FOLDER}/testDownloadFile/`;
//     const testFilePath = "tmp/sample-zip-file.zip";
//     fs.copyFileSync(
//         `${FIXTURES_FOLDER}/sample-zip-file.zip`,
//         `${unzipFolderPath}/fileToUnzip.zip`
//     );
//     const result = await unzipAndDeleteFile(
//         `${unzipFolderPath}/fileToUnzip.zip`,
//         unzipFolderPath
//     );
//     expect(result).toBeDefined()
// });


test("executable exists", async () => {
    const gitExecutableExists = isGitInstalled()
    console.log(gitExecutableExists)

})

test("setup git", async() => {
    const setupGitResponse = await setupGit()
    console.log(setupGitResponse)
});