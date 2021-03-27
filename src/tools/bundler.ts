import {downloadMacBinaries, downloadWinBinaries} from "./downloader";

(async () => {
    console.log("Bundling...")
    await downloadWinBinaries()
    await downloadMacBinaries()
    console.log("Bundled!")
})()


