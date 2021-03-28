"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloud_1 = require("./cloud");
// test("1 + 1", () => expect(1).toBe(1));
test("can get authorization", async () => {
    const b2Client = await cloud_1.getB2Client();
    expect(b2Client.accountId).toBeDefined();
});
test("can upload archive and list archives", async () => {
    const archivePath = "src/lib/test.zip";
    const uploadResult = await cloud_1.uploadArchive(archivePath);
    expect(uploadResult['fileId']).toBeDefined();
    const listResult = await cloud_1.listUploadedArchives();
    expect(listResult.files.length).toBe(1);
});
