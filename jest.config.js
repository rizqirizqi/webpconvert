// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

export default {
  bail: true,
  clearMocks: true,
  collectCoverageFrom: [
    '**/*.js',
    '!**/*.config.js',
    '!**/{_doc,build,config,coverage,node_modules}/**',
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    '/node_modules/(?!(directory-tree)/)'
  ],
};
