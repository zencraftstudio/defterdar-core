"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const downloader_1 = require("./downloader");
(async () => {
    console.log("Bundling...");
    await downloader_1.downloadWinBinaries();
    await downloader_1.downloadMacBinaries();
    console.log("Bundled!");
})();
