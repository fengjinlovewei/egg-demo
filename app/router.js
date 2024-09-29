/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  const report = app.middleware.report({ });
  router.get('/', report, controller.home.index);
  router.get('/news', report, controller.news.list);
};
