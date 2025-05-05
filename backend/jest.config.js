/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'], // include test dan src
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: [
    '**/test/**/*.test.ts', // unit test
    '**/modules/**/__tests__/**/*.test.ts' // integration test
  ],
  clearMocks: true,
  coverageDirectory: "coverage", // opsional
};
