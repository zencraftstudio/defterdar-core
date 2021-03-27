import {downloadMacBinaries} from "./downloader";

test("download mac binaries",async ()=>{
    const downloadMacBinariesResult = await downloadMacBinaries()
    console.log(downloadMacBinariesResult)
})
