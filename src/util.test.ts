import {getGitExecutable} from "./util";

test("can get git executble", () => {
    const gitExecutble = getGitExecutable()
    expect(gitExecutble).toBeDefined()
});
