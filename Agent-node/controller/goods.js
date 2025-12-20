const { modelGoods } = require("@/model/goods");
const fs = require("fs");
const Validate = require("@/validate/index");
const { apiKey } = require("@/config/default").aliyun;
const OpenAI = require("openai");
const openai = new OpenAI({
  // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
  apiKey,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

class GoodsController {
  //导入商品
  async addGoods(ctx) {
    const goodsFile = fs.readFileSync(
      "D:/Web/agent/Agent-node/goods.json",
      "utf-8"
    );
    const json = JSON.parse(goodsFile);
    // await modelGoods.insertMany(json);
  }
  //查询商品详情
  async goodsDetail(ctx) {
    const { goodsId } = ctx.request.body;
    await Validate.nullCheck(goodsId, "请传入商品ID", "goodsId");
    const res = await modelGoods.findById(goodsId);
    ctx.send(res);
  }
  //通过大模型提取关键词，搜索商品
  async searchGoods(ctx) {
    const { userMeaasge } = ctx.request.body;
    await Validate.nullCheck(userMeaasge, "缺少用户对话", "userMeaasge");
    const completion = await openai.chat.completions.create({
      model: "qwen-plus", //模型列表
      messages: [
        {
          role: "system",
          content:
            '你的主要职责就是根据提问提取关键词，我会给你发送一段用户的提问，你根据提问从中提取一个或两个景点关键词出来（不超过两个），你要特别注意，这里的关键词我需要涉及旅游，攻略城市地点相关的，当提取到关键词时你需要把关键词组合成一个json格式的数组字符串返回来，格式比如：["丽江","大理"],如果没有提取到你就回复一个null即可，如果提问中包含车票查询、天气查询、打招呼或与旅游，景点介绍无关的提问，直接回复null',
        },
        {
          role: "user",
          content: `用户提问:${userMeaasge}`,
        },
      ],
    });
    // console.log(completion);
    const keyWords = completion.choices[0].message.content;
    if (keyWords && keyWords !== "null") {
      // 构建查询条件
      const queryConditions = JSON.parse(keyWords).map((item) => ({
        contentTitle: {
          $regex: new RegExp(item, "i"),
        },
      }));
      const res = await modelGoods
        .find({ $or: queryConditions })
        .limit(10)
        .select("coverImage contentTitle price");
      ctx.send(res);
    } else {
      ctx.send([], 200, "未提取到关键词", null, 201);
    }
    // ctx.send(completion.choices[0].message);
  }
}
module.exports = new GoodsController();
