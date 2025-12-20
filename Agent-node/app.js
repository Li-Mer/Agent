const Koa = require("koa");
const app = new Koa();
const json = require("koa-json");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
//静态文件处理
const static = require("koa-static");
const path = require("path");
const { addAliases } = require("module-alias");
addAliases({
  "@": __dirname,
});

const router = require("@/router");
//统一接口响应数据格式
const responseHandler = require("@/config/result");
//捕获错误的中间件
const errorHandler = require("@/config/errorhandler");

app.use(json());
app.use(bodyParser());
app.use(cors());
app.use(responseHandler);
app.use(errorHandler);
app.use(static(path.join(__dirname)));
app.use(router.routes()).use(router.allowedMethods());

app.listen(7000, () => {
  console.log("Agent-node server is running on port 7000!");
});
