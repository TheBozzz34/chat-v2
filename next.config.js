// next.config.js
module.exports = {
    // ...
    future: {
      webpack5: true,
    },
    webpack: (config) => {
      config.resolve.modules.push(__dirname);
      return config;
    },
  };
  