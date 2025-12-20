const {
  appCode,
  queryTrainTicketsUrl,
  queryWeatherUrl,
} = require("@/config/default");
const Validate = require("@/validate/index");
const axios = require("axios").default;
class CallToolController {
  //火车票查询
  async queryTrainTickets(ctx) {
    const { departure, destination, date } = ctx.request.body;
    await Validate.nullCheck(departure, "请传入出发地", "departure");
    await Validate.nullCheck(destination, "请出入到达站", "destination");
    await Validate.nullCheck(date, "请传入出发时间", "date");
    try {
      const res = await axios.get(queryTrainTicketsUrl, {
        params: { start: departure, end: destination, date: date },
        headers: { Authorization: `APPCODE ${appCode}` },
      });
      console.log(res);
      ctx.send(res.data.result.list);
    } catch (error) {
      console.log(error);
      const status = ["201", "203"];
      if (status.includes(error.response.data.status)) {
        ctx.send(
          [],
          200,
          "很抱歉，未查询到相关车次信息，请确认出发地、到达站和出发时间是否正确",
          null,
          201
        );
      } else {
        throw { msg: "查询出现异常错误", code: 400, validate: null };
      }
    }
  }
  //查询天气
  async queryWeather(ctx) {
    const { city } = ctx.query;
    await Validate.nullCheck(city, "请传入城市名称", "city");
    try {
      const res = await axios.get(queryWeatherUrl, {
        params: { area: city },
        headers: { Authorization: `APPCODE ${appCode}` },
      });
      console.log(res);
      ctx.send(res.data.showapi_res_body.dayList);
    } catch (error) {
      console.log("出错");
      console.log(error);
      if (error.response.statue === 450 && error.response.data) {
        ctx.send(
          [],
          200,
          "没有查询到该城市的天气信息，你可以重复尝试哦",
          null,
          201
        );
      } else {
        throw { msg: "查询出现异常错误", code: 400, validate: null };
      }
    }
  }
}
module.exports = new CallToolController();
