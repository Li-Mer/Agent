const logger = require("@/loggerMiddleware");
//捕获错误的中间件
const errorHandler = async (ctx, next) => {
  try {
    await next();
    logger.info(`输出日志：${ctx.method} ${ctx.url} - ${ctx.status}`);
  } catch (errorData) {
    logger.error(errorData);
    console.error("服务器错误", errorData.message);
    if (errorData.validate === null) {
      const { code, msg, error } = errorData;
      const errorVal = error || null;
      ctx.send(null, code, msg, errorVal);
      return;
    } else if (errorData.message === "Unexpected end of form") {
      ctx.send(null, 422, "请上传图片", null);
    } else {
      const error = errorData.message || "异常错误，请查看服务器端日志";
      const status = (ctx.status =
        errorData.status || errorData.statusCode || 500);
      ctx.send(null, status, "服务器端异常错误", error);
    }
  }
};
module.exports = errorHandler;
