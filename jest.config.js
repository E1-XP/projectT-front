module.exports = {
  testEnvironment: "jest-environment-jsdom",
  automock: false,
  setupFilesAfterEnv: ["./src/tests/setupJest.js"],
};
