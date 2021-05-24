/**
 * Scans directories  recursively and collects file paths
 * @param {string} dir - Starting directory path.
 * @param {function} filterCallback - Custom filtering while scanning files.
 * @returns {Array} - Array of found file paths.
 */
declare const readdirRecursive: (dir: string, filterCallback: undefined | any) => Promise<any[]>;
export default readdirRecursive;
