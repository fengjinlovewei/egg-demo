module.exports = () => {
  return async function (ctx, next) {
    console.log("leve3-start");
    await next();
    console.log("leve3-end");
  };
};
