module.exports = {
  testEnvironment: "jsdom",
  collectCoverage: false,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx,js,jsx}",
    "scripts/**/*.{ts,tsx,js,jsx}",
    "!src/**/*.spec.{ts,tsx,js,jsx}",
    "!src/**/*.stories.tsx",
  ],
  coverageDirectory: "<rootDir>/.coverage/",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/_mocks_/fileMock.js",
    "\\.(css|sass|scss)$": "identity-obj-proxy",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)test.[jt]s?(x)"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
    "^.+\\.js?$": "babel-jest",
    "^.+\\.jsx?$": "babel-jest",
    "\\.(d\\.ts|[jt]sx?)$": "ts-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(nanoid|uuid|@tradetrust-tt/tradetrust|@tradetrust-tt/token-registry)/)",
    "node_modules/(?!axios)/",
  ],
};
