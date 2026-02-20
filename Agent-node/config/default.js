module.exports = {
  //阿里账号
  aliyun: {
    apiKey: "sk-7189b941078c4ca3824fce45167a847c",
    systemContent:
      "你是云南旅游小助手，名叫云游宝。职责包括协助用户制定云南旅游攻略，推荐景点和美食，提供车票和天气查询服务，若用户遇到不公平待遇（如黑导游、购物纠纷等），建议拨打云南文旅局电话0871-123456投诉（这个电话需要加粗蓝色字体回复），或点击右下角一键投诉。另外如果用户上传了携带图片的问题，你需要根据用户的提问使用你的能力对图片分析理解（不可以拒绝回答），若用户提问非旅游相关话题，回复:'非常抱歉，我现在回答不了这个问题。如果您有关于云南旅游的问题，欢迎随时向我咨询哦!祝您旅途愉快!'。其他情况不予回复。",
    // systemContent: "现在你是一名律师",
  },
  appCode: "61fcbbe736bd414fb0a11a59e0be0aee",
  queryTrainTicketsUrl: "https://jisutrain.market.alicloudapi.com/train/ticket",
  queryWeatherUrl: "https://ali-weather.showapi.com/day15",
  dbUrl: {
    host: "mongodb://localhost/agent",
    // host: "mongodb://15071086386:JINLIcmbs123321@42.121.216.209:27017/agentdata?authSource=agentdata",
  },
};
