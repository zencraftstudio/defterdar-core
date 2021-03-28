import {getB2Client, listUploadedArchives, uploadArchive} from "./cloud"

// test("1 + 1", () => expect(1).toBe(1));

test("can get authorization", async () => {
    const b2Client = await getB2Client();
    expect(b2Client.accountId).toBeDefined()
});

test("can upload archive and list archives", async () => {
    const archivePath = "src/lib/test.zip"
    const uploadResult = await uploadArchive(archivePath)
    expect(uploadResult['fileId']).toBeDefined()
    const listResult = await listUploadedArchives()
    expect(listResult.files.length).toBe(1)
});
