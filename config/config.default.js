/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1727246891264_8569";

  config.view = {
    defaultViewEngine: "nunjucks",
    mapping: {
      ".tpl": "nunjucks",
    },
  };

  config.news = {
    pageSize: 5,
    serverUrl: "https://hacker-news.firebaseio.com/v0",
  };

  // add your middleware config here
  config.middleware = ["leve1", "leve2", "leve3", "robot"];

  // robot's configurations
  config.robot = {
    ua: [/Baiduspider/i],
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
