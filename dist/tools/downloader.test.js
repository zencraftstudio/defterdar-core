"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const downloader_1 = require("./downloader");
test("download mac binaries", async () => {
    const downloadMacBinariesResult = await downloader_1.downloadMacBinaries();
    console.log(downloadMacBinariesResult);
});
test("download windows binaries", async () => {
    const downloadWindowsBinariesResult = await downloader_1.downloadWinBinaries();
    console.log(downloadWindowsBinariesResult);
});
