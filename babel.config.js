module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["@babel/env", "@babel/react"],
    plugins: ["@babel/plugin-proposal-object-rest-spread"]
  };
};
