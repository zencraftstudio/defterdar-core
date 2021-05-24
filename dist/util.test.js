"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
test("can get git executable path", () => {
    const gitExecutable = util_1.getGitExecutablePath();
    expect(gitExecutable).toBeDefined();
});
test("download git build", async () => {
    const gitBuild = await util_1.downloadGitBuild();
    expect(gitBuild).toBeTruthy();
}, 15000);
test("can get os arch info", () => {
    const osArchInfo = util_1.getOsArchInfo();
    expect(osArchInfo).toBeDefined();
});
test("can get download url", async () => {
    const downloadUrl = await util_1.getGitDownloadUrl();
    expect(downloadUrl).toBeDefined();
});
