/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
// @ts-nocheck

export default {
  testRunner: "jest",
  reporters: ["progress", "clear-text", "html"],
  mutate: [
    "src/**/*.js",
    "!src/**/*.test.js",
    "!src/**/*.spec.js"
  ],
  testRunnerNodeArgs: ["--experimental-vm-modules"]
};