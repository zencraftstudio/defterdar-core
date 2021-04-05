import {readFile} from "fs/promises"

const B2 = require('backblaze-b2');
const path = require("path");


const getCredentials = () => {
    return {
        applicationKeyId: '0002d64d981389a0000000002', // or accountId: 'accountId'
        applicationKey: 'K000RkYNpmS8E70iAfQg/kUciQzgZiw', // or masterApplicationKey
        folderPrefix: 'test_folder_prefix'
    }
}

const getCloudParameters = () => {
    return {
        bucket: '824dd6c45dd978817388091a'
    }
}

const prefixObjectKey = (object_key: string) => `${getCredentials()["folderPrefix"]}/${object_key}`

export const getB2Client = async () => {
    const b2 = new B2({
        applicationKeyId: getCredentials()['applicationKeyId'], // or accountId: 'accountId'
        applicationKey: getCredentials()['applicationKey'], // or masterApplicationKey
        // optional:
        axios: {
            // overrides the axios instance default config, see https://github.com/axios/axios
        },
        retry: {
            retries: 3 // this is the default
            // for additional options, see https://github.com/softonic/axios-retry
        }
    });
    // authorize with provided credentials
    await b2.authorize({
        // ...common arguments (optional)
    });  // returns promise
    return b2
}

export const uploadArchive = async (archivePath: string) => {
    const b2 = await getB2Client();

    const uploadRequest = await b2.getUploadUrl({
        bucketId: getCloudParameters()['bucket']
    })
    // upload file
    const uploadResponse = await b2.uploadFile({
        uploadUrl: uploadRequest.data.uploadUrl,
        uploadAuthToken: uploadRequest.data.authorizationToken,
        fileName: prefixObjectKey(path.basename(archivePath)),
        mime: 'application/zip', // optional mime type, will default to 'b2/x-auto' if not provided
        data: await readFile(archivePath), // this is expecting a Buffer, not an encoded string
        info: {},
        onUploadProgress: (event: any) => {
            console.log(event)
        } // progress monitoring

    });  // returns promise
    return uploadResponse.data
}

export const listUploadedArchives = async () => {
    const b2 = await getB2Client();

    // list file names
    const filenamesRepsonse = await b2.listFileNames({
        bucketId: getCloudParameters()['bucket'],
        maxFileCount: 100,
        prefix: getCredentials()['folderPrefix']
        // ...common arguments (optional)
    });  // returns promise
    return filenamesRepsonse.data
}

export const listUploadedArchiveVersions = async (archivePath: string) => {
    const b2 = await getB2Client();

    const fileVersionsResponse = await b2.listFileVersions({
        bucketId: getCloudParameters()['bucket'],
        maxFileCount: 100,
        prefixObjectKey: getCredentials()['folderPrefix']
        // ...common arguments (optional)
    });  // returns promise
    return fileVersionsResponse.data
}
//
// export const deleteUploadedArchiveVersion = async (archiveVersionId: string) => {
//
// }
