import {mkdir, rmdir, writeFile} from "fs/promises"
import simpleGit from "simple-git"
import {randomBytes, randomInt} from "crypto"

const REPOSITORIES_PATH = "src/lib/test/test_repositories"

export const initNewRepositoryFolder = async (folderName: string) => {
    await mkdir(`${REPOSITORIES_PATH}/${folderName}`, {recursive: true})
    return `${REPOSITORIES_PATH}/${folderName}`
}

// sleep time expects milliseconds
function sleep(time: number) {
    return new Promise(resolve => setTimeout(resolve, time))
}

export const cleanRepositoriesFolder = async () => {
    await sleep(1000).then(() => rmdir(REPOSITORIES_PATH, {recursive: true}))
}

export const replaceFileContent = async (filePath: string) => {
    const randomContent = randomBytes(100)
    await writeFile(filePath, randomContent)
    return randomContent
}

export const createTestCommits = async (folderPath: string, numberOfCommits: number) => {
    const git = simpleGit(folderPath).init()
    for (let i = 0; i < numberOfCommits; i++) {
        // eslint-disable-next-line no-await-in-loop
        await replaceFileContent(`${folderPath}/${randomInt(100)}`)
        // eslint-disable-next-line no-await-in-loop
        await git.add("*").commit(`commit ${i}`)
    }
}
