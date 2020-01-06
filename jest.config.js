module.exports = {
  testMatch: ["<rootDir>/test/*Test.js"],
  transformIgnorePatterns: ["node_modules/(?!(date-fns))"],
  notify: true,
  verbose: false
};
