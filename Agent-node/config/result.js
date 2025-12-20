//统一接口响应数据格式
const responsseHandler = async (ctx, next) => {
  ctx.send = (
    data = null,
    code = 200,
    msg = "success",
    error = null,
    serviceCode = 200
  ) => {
    ctx.body = {
      serviceCode,
      msg,
      data,
      error,
    };
    ctx.status = code;
  };
  await next();
};
module.exports = responsseHandler;
