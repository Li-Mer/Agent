const Router = require("@koa/router");
const router = new Router();

//用户相关
const user = require("@/controller/user");
//文件上传中间件
const uploadFile = require("@/config/uploadfile");
//商品
const goods = require("@/controller/goods");

//用户登录
router.post("/wxLogin", user.wxLogin);

//大模型对话
const chat = require("./controller/chat");
router.post("/chatMessage", chat.chatMessage);
//文件上传
router.post("/uploadFile", uploadFile.single("file"), chat.uploadFile);

//火车票查询
const calltool = require("@/controller/calltool");
router.post("/queryTrainTickets", calltool.queryTrainTickets);
router.get("/queryWeather", calltool.queryWeather);

//导入商品数据
router.get("/addGoods", goods.addGoods);
//查询商品详情
router.post("/goodsDetail", goods.goodsDetail);
//搜索商品
router.post("/searchGoods", goods.searchGoods);

module.exports = router;
