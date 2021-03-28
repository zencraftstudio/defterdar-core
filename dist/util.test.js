"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
test("can get git executble", () => {
    const gitExecutble = util_1.getGitExecutable();
    expect(gitExecutble).toBeDefined();
});
