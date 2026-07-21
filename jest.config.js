const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  coverageThreshold: {
      global: {
          branches: 70,
          functions: 80,
          lines: 80,
          statements: 80
      }
  }
};