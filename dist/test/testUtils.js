"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestCommits = exports.replaceFileContent = exports.cleanRepositoriesFolder = exports.initNewRepositoryFolder = void 0;
const tslib_1 = require("tslib");
const promises_1 = require("fs/promises");
const simple_git_1 = tslib_1.__importDefault(require("simple-git"));
const crypto_1 = require("crypto");
const REPOSITORIES_PATH = "src/lib/test/test_repositories";
const initNewRepositoryFolder = async (folderName) => {
    await promises_1.mkdir(`${REPOSITORIES_PATH}/${folderName}`, { recursive: true });
    return `${REPOSITORIES_PATH}/${folderName}`;
};
exports.initNewRepositoryFolder = initNewRepositoryFolder;
// sleep time expects milliseconds
function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
const cleanRepositoriesFolder = async () => {
    await sleep(1000).then(() => promises_1.rmdir(REPOSITORIES_PATH, { recursive: true }));
};
exports.cleanRepositoriesFolder = cleanRepositoriesFolder;
const replaceFileContent = async (filePath) => promises_1.writeFile(filePath, crypto_1.randomBytes(100));
exports.replaceFileContent = replaceFileContent;
const createTestCommits = async (folderPath, numberOfCommits) => {
    const git = simple_git_1.default(folderPath).init();
    for (let i = 0; i < numberOfCommits; i++) {
        // eslint-disable-next-line no-await-in-loop
        await exports.replaceFileContent(`${folderPath}/${crypto_1.randomInt(100)}`);
        // eslint-disable-next-line no-await-in-loop
        await git.add("*").commit(`commit ${i}`);
    }
};
exports.createTestCommits = createTestCommits;
