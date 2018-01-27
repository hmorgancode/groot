// configuration file for Wallaby.js - http://wallabyjs.com/
const wallabyConfig = (wallaby) => ({
  files: [
    'src/**/*.js?(x)',
    'src/**/*.json',
    'src/**/*.snap',
    'src/App.css',
    // Exclude test files.
    { pattern: 'src/**/*.test.js?(x)', ignore: true },
  ],
  tests: [
    'src/**/*.test.js?(x)',
  ],
  // Jest runs in node
  env: {
    type: 'node',
    runner: 'node',
  },
  compilers: {
    '**/*.js?(x)': wallaby.compilers.babel(),
  },
  testFramework: 'jest',
});

module.exports = wallabyConfig;
