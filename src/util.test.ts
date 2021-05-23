import {downloadGitBuild, getGitDownloadUrl, getGitExecutablePath, getOsArchInfo} from "./util";

test("can get git executable path", () => {
    const gitExecutable = getGitExecutablePath()
    expect(gitExecutable).toBeDefined()
});


test("download git build", async ()=>{
    const gitBuild = await downloadGitBuild()
    return "hello world"
}, 15000)


test("can get os arch info", () =>{
    const osArchInfo = getOsArchInfo()
    expect(osArchInfo).toBeDefined()
})


test("can get download url", async() => {
    const downloadUrl = await getGitDownloadUrl()
    expect(downloadUrl).toBeDefined()
});
