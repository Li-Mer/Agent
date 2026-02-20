import type {
    conversationType,
    QueryTrainTicketsType,
    ServerQueryTrainTicketsType,
    QueryWeatherType,
    ServerQueryWeatherType,
    ServerSearchGoodsType,
    SearchGoodsType,
    ServerGoodsDetails,
    ComplaintType
} from "@/types/index";
const requestUrl = "http://127.0.0.1:7000"
// const requestUrl = "http://101.37.37.11"
import { chatbotMessage } from "@/store/index";
import { showToast } from 'vant';

//fetch请求
const fetchApi = async (url: string, method: "POST" | "GET", body?: any, resType = "stream", reqType = "json") => {
    const headers:HeadersInit = {
        ...(reqType == 'json' && {"Content-Type": "application/json"})
    }
    let bodyData = null;
    if (reqType == 'json') { 
        bodyData = JSON.stringify(body);
    } else if (method == "GET") {
        bodyData = null;
    } else {
        bodyData = body;
    }
    const options: RequestInit = {
        method,
        headers,
        body: bodyData
    }
    const response = await fetch(url, options);
    console.log("response", response);
    //非流式输出
    if (response.ok && resType != "stream") { 
        const result:any = response.json();
        return result;
    }
    //请求失败的错误
    if (!response.ok) {
        const errorData = await response.json();
        const status = response.status;
        switch (status) {
        case 404:
            console.error("404错误");
            break;
        case 500:
        case 501:
        case 502:
            console.error("发生异常错误");
            showToast({ message: "出现异常错误", duration: 1000 });
            break;
        case 400:
            console.error("参数不对");
            break;
        case 422:
            console.error("参数不对");
            showToast({ message: errorData.msg, duration: 1000 });
            break;
        }
        // 如果出现错误，用户依然可以点击按钮
        chatbotMessage().prohibit = false;
        if (chatbotMessage().messages.length > 0) {
            chatbotMessage().messages[chatbotMessage().messages.length - 1]!.progress = false;
        }
        throw errorData;
    }
    //流式输出
    if (response.ok && resType == "stream") { 
        const reader = response.body?.getReader();
        while (reader) {
            const { done, value } = await reader.read();
            if (done) break;
            // console.log("value", value);
            //字节流解码为utf-8字符串
            const decoder = new TextDecoder("utf-8");
            //解码二进制数据为字符串
            const decodedString = decoder.decode(value);
            // console.log("string", decodedString);
            if (decodedString !== "OK") {
                //在字符串中查询并提取所有成对的{}之间的内容
                //这段代码的主要目的是从一段可能包含多个连续 JSON 对象的字符串中，提取出每一个完整的 JSON 对象字符串。在网络流式传输（Stream）中，经常会出现“粘包”现象，即一次接收到的数据可能包含两个或多个连在一起的 JSON 对象（例如 {"a":1}{"b":2}）。这段代码通过计算大括号 {} 的层级深度，来正确分割它们，同时还能兼容嵌套的对象。
                const matches = [];
                let depth = 0;
                let start = 0;
                for (let i = 0; i < decodedString.length; i++) { 
                    if (decodedString[i] === '{') {
                        if (depth === 0) {
                            start = i;
                        }
                        depth++;
                    } else if (decodedString[i] === '}') { 
                        depth--;
                        if(depth === 0) {
                            matches.push(decodedString.substring(start, i + 1));
                        }
                    }
                }
                // console.log("matches", matches);
                for (let index = 0; index < matches.length; index++) {
                    const jsonString = matches[index];
                    if (!jsonString || typeof jsonString !== "string") continue;
                    try {
                        const res = JSON.parse(jsonString);
                        //console.log("Parsed JSON chunk:", res);//Parsed JSON chunk: {type: 'content', functionName: '', data: '你好'}
                        chatbotMessage().serverData(res)
                        // handle res if needed
                    } catch (e) {
                        console.warn("Failed to parse JSON chunk:", jsonString, e);
                        continue;
                    }
                }
            }
            if (decodedString == "OK") {
                console.log("请求完成");
            }
            // return value;
        }
    }
}

//统一返回的结果类型
interface ApiResponse<T>{
    data: T,
    msg: string,
    error: any,
    serviceCode: number,
    code: number,
}
//发送消息
export const chatMessageApi = (data:{chatMessage:conversationType}):Promise<ApiResponse<Buffer>>=>{
    return fetchApi(`${requestUrl}/chatMessage`,"POST",data);
}
//查询火车票
export const queryTrainTickets = (data: QueryTrainTicketsType): Promise<ApiResponse<ServerQueryTrainTicketsType>> => {
    return fetchApi(`${requestUrl}/queryTrainTickets`, "POST", data, "nostream");
};
//查询天气
export const queryWeather = (data: QueryWeatherType): Promise<ApiResponse<ServerQueryWeatherType>> => {
    return fetchApi(`${requestUrl}/queryWeather?city=${data.city}`, "GET", '', "nostream","no");
}
// 搜索商品
export const searchGoods = (data: SearchGoodsType): Promise<ApiResponse<ServerSearchGoodsType>> => {
  return fetchApi(`${requestUrl}/searchGoods`, "POST", data, "nostream");
};
// 查看商品详情
export const goodsDetails = (data: { goodsId: string }): Promise<ApiResponse<ServerGoodsDetails>> => {
  return fetchApi(`${requestUrl}/goodsDetails`, "POST", data, "1234");
};
// 图片上传
export const uploadFile = (data: FormData): Promise<ApiResponse<string>> => {
  return fetchApi(`${requestUrl}/uploadFile`, "POST", data, "1234", "1234");
};
// 提交投诉
export const addComplaint = (data: ComplaintType): Promise<ApiResponse<null>> => {
  return fetchApi(`${requestUrl}/addComplaint`, "POST", data, "1234");
};
