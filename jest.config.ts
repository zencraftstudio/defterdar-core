// jest.config.ts
import type { Config } from "@jest/types"

// Or async function
export default async (): Promise<Config.InitialOptions> => {
    return {
        verbose: true,
        preset: "ts-jest",
        testEnvironment: "node",
        roots: ["<rootDir>/src"],
        transform: {
            "node_modules/variables/.+\\.(j|t)sx?$": "ts-jest",
        },
        transformIgnorePatterns: ["node_modules/(?!variables/.*)"],
    }
}
