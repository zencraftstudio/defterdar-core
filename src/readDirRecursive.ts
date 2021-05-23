const path = require('path');
const {readdir} = require('fs').promises;

/**
 * Scans directories  recursively and collects file paths
 * @param {string} dir - Starting directory path.
 * @param {function} filterCallback - Custom filtering while scanning files.
 * @returns {Array} - Array of found file paths.
 */
const readdirRecursive = async (dir: string, filterCallback: undefined | any) => {
    const files = []
    for await (const file of iteratedirRecursive(dir)) {
        if (typeof filterCallback === "function") {
            if (filterCallback(file)) {
                files.push(file)
            }
        } else {
            files.push(file)
        }
    }
    return files
}

export default readdirRecursive

/**
 * Iterates directories recursively
 * @param {string} dir - Starting directory path.
 * @yields {string} - Yields file path.
 */
async function* iteratedirRecursive(dir: string): any {
    const entries = await readdir(dir, {withFileTypes: true});
    for (const entry of entries) {
        const entryPath = path.resolve(dir, entry.name);
        if (entry.isDirectory()) {
            yield* iteratedirRecursive(entryPath);
        } else {
            yield entryPath;
        }
    }
}


/* ----------------------------- design doc --------------------------------

* readdirRecursive
* A native utility function for collecting files recursively.
    - It collects and filters data coming from iteratedirRecursive generator
    - If callback is passed, it filters the entry by passed filtering function
    - for await method should be used for async generators/iterators, so it can get .next() value from generator iteration

* iteratedirRecursive
* An async generator to handle large inputs in performant way.
    - It resolves promise from readdir
    - Then checking all items if they're directory
    - If entry is a direcrtory, it executes itself again
*/
