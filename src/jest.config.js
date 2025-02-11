module.exports = {
  testEnvironment: "jest-fixed-jsdom", // Use jsdom for React testing
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest", // Use babel-jest for .js and .jsx files
  },
  transformIgnorePatterns: [
    // Allow Jest to transform axios and other ES6 modules
    "node_modules/(?!(axios|other-es6-module)/)",
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS imports
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Add setup file for TextEncoder/TextDecoder polyfill
  setupFiles: ["./jest.setup.js"],
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
};
