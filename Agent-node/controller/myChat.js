const OpenAI = require("openai");
const { Stream } = require("openai/core/streaming.js");
const { apiKey, systemContent } = require("../config/default").aliyun;
const Validate = require("@/validate/index");
const tools = require("@/config/tools");
const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

class ChatController {
  //对话，流式输出
  async chatMessage(ctx) {
    const { chatMessage } = ctx.request.body;
    //校验
    await Validate.isarrayCheck(
      chatMessage,
      "chatMessage字段不能为空",
      "chatMessage"
    );
    let messages = [
      //role system：大模型的行为规范 user：用户输入 assistant：大模型输出
      {
        role: "system",
        content: systemContent,
      },
      ...chatMessage,
    ];
    const completion = await openai.chat.completions.create({
      model: "qwen-plus", // 此处以qwen-plus为例，可按需更换模型名称。模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
      messages: messages,
      stream: true,
      tools,
    });
    ctx.status = 200;
    let functionName = ""; //函数名称
    let requireParams = ""; //函数参数
    // console.log(JSON.stringify(completion));
    // 迭代输出（流式输出）
    for await (const chunk of completion) {
      // console.log(JSON.stringify(chunk));
      const str = JSON.stringify(chunk);
      const obj = JSON.parse(str);
      const choices = obj.choices[0].delta;
      if (choices.content === null && choices.tool_calls) {
        console.log("工具调用----------------");
        if (messages[messages.length - 1].role !== "assistant") {
          messages.push({
            role: "assistant",
            content: "",
            tool_calls: [],
          });
          var lastMessage = messages[messages.length - 1];
        }
        //模型回复的要调用的工具和调用工具时需要的参数取出来
        const toolCalls = choices.tool_calls;
        if (toolCalls.length > 0) {
          if (lastMessage.tool_calls.length <= 0) {
            functionName = toolCalls[0].function.name;
            lastMessage.tool_calls.push(toolCalls[0]);
          }
        }
        //遍历取出函数参数
        toolCalls.forEach((item) => {
          if (item.function.arguments) {
            requireParams += item.function.arguments;
          }
          lastMessage.tool_calls[0].function.arguments = requireParams;
        });
      }
      //把工具调用的结果返回给前端
      if (obj.choices[0].finish_reason === "tool_calls") {
        console.log("函数名称：" + JSON.stringify(functionName, null, 2));
        console.log("函数参数：" + JSON.stringify(requireParams));
        console.log("Messages: " + JSON.stringify(messages, null, 2));
        const resObj = JSON.stringify({
          type: "function",
          functionName: functionName,
          data: JSON.stringify(requireParams),
        });
        const buffer = Buffer.from(resObj);
        ctx.res.write(buffer);
      }
    }
  }
}
module.exports = new ChatController();
