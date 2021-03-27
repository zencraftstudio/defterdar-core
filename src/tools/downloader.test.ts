import {downloadMacBinaries, downloadWinBinaries} from "./downloader";

test("download mac binaries", async () => {
    const downloadMacBinariesResult = await downloadMacBinaries()
    console.log(downloadMacBinariesResult)
})

test("download windows binaries", async () => {
    const downloadWindowsBinariesResult = await downloadWinBinaries()
    console.log(downloadWindowsBinariesResult)
});
