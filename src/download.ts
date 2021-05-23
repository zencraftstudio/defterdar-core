import { IncomingMessage } from "http";
import fs from "fs";

interface DownloadResponse extends IncomingMessage { headers: any }

const download = (url: string, dirPath: string, fileName: string ) => {
    try {
        if(!dirPath){
            throw new Error("You need to pass dir path.")
        }
        if(!fs.lstatSync(dirPath).isDirectory()){
            throw new Error(`${dirPath}, is not a directory.`)
        }

        const filePath: string = dirPath + fileName;

        const protocol: any = url.includes('https') ? 'https' : 'http'

        return new Promise((resolve, reject) => {
            let fileInfo: any = null;

            const request = require(protocol).get(url, (response: DownloadResponse) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                    return
                }
                if ("headers" in response ){
                    const file = fs.createWriteStream( filePath );

                    fileInfo = {
                        name: fileName,
                        path: filePath ? filePath : `${dirPath}${fileName}`,
                        mime: response.headers['content-type'],
                        size: parseInt(response.headers['content-length'], 10)
                    };

                    response.pipe(file)

                    file.on('finish', () => resolve(fileInfo))

                    file.on('error', err => {
                        fs.unlink(filePath, () => reject(err))
                    })

                } else {
                    reject(new Error(`Headers not found in response: ${url}`));
                    return
                }
            })

            request.on('error', (err: any) => {
                fs.unlink(filePath, () => reject(err));
            });

            request.end();
        });
    } catch(e){
        console.error(e)
        return
    }
}

export default download
