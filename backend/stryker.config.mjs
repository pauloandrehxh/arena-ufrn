/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
export default {
  testRunner: "jest",
  plugins: ["@stryker-mutator/jest-runner"],
  reporters: ["progress", "clear-text", "html"],
  mutate: [
    "src/**/*.js",
    "!src/**/*.test.js",
    "!src/**/*.spec.js"
  ],
  testRunnerNodeArgs: ["--experimental-vm-modules"]
};