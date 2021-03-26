"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Or async function
exports.default = async () => {
    return {
        verbose: true,
        preset: "ts-jest",
        testEnvironment: "node",
        roots: ["<rootDir>"],
        transform: {
            "node_modules/variables/.+\\.(j|t)sx?$": "ts-jest",
        },
        transformIgnorePatterns: ["node_modules/(?!variables/.*)"],
    };
};
