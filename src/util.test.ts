import fs from "fs";
import {
  downloadFile,
  getGitDownloadUrl,
  getGitExecutablePath,
  getOsArchInfo, setupGit,
  unzipAndDeleteFile,
} from "./util";

test("can get git executable path", () => {
  const gitExecutable = getGitExecutablePath();
  expect(gitExecutable).toBeDefined();
});

// test("download git build", async ()=>{
//     const gitBuild = await downloadGitBuild()
//     expect(gitBuild).toBeTruthy()
// }, 15000)

test("can get os arch info", () => {
  const osArchInfo = getOsArchInfo();
  expect(osArchInfo).toBeDefined();
});

test("can get download url", async () => {
  const downloadUrl = await getGitDownloadUrl();
  expect(downloadUrl).toBeDefined();
});

const TEMP_FOLDER = `${process.cwd()}/tmp`;
const FIXTURES_FOLDER = `${process.cwd()}/test/fixtures`;

test("downloadfile", async () => {
  const testDownloadFileUrl =
    "https://file-examples-com.github.io/uploads/2019/09/file-sample_100kB.rtf";
  const downloadPath = `${TEMP_FOLDER}/testDownloadFile/`;
  fs.mkdirSync(downloadPath, { recursive: true });
  const downloadResult = await downloadFile(testDownloadFileUrl, downloadPath);
  expect(downloadResult).toBeDefined();
});

test("unzipFile", async () => {
  const unzipFolderPath = `${TEMP_FOLDER}/testDownloadFile/`;
  const testFilePath = "tmp/sample-zip-file.zip";
  fs.copyFileSync(
    `${FIXTURES_FOLDER}/sample-zip-file.zip`,
    `${unzipFolderPath}/fileToUnzip.zip`
  );
  const result = await unzipAndDeleteFile(
    `${unzipFolderPath}/fileToUnzip.zip`,
    unzipFolderPath
  );
  expect(result).toBeDefined()
});

test("setup git", async() => {
  const setupGitResponse = await setupGit()
  console.log(setupGitResponse)
})