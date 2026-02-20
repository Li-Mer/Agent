import type { conversationType, sendMessageType, serverDataType, ServerSearchGoodsType, TextContent, ServerQueryWeatherType, ServerQueryTrainTicketsType } from "@/types";
import { defineStore } from "pinia";
import { chatMessageApi, queryTrainTickets, queryWeather, searchGoods } from "@/api/request";

type CacheEntry<T> = {
    ts: number;
    data: T;
};

const now = () => Date.now();
const TTL = {
    weatherMs: 60 * 60 * 1000 * 3, // 3小时
    trainMs: 10 * 60 * 1000, // 10分钟
};
// 统一 key 生成（避免大小写/空格导致重复缓存）
const normalizeKey = (s: string) => (s || "").trim().toLowerCase();
const weatherKey = (city: string) => `weather:${normalizeKey(city)}`;
const trainKey = (departure: string, destination: string, date: string) =>
  `train:${normalizeKey(departure)}->${normalizeKey(destination)}@${normalizeKey(date)}`;



export const chatbotMessage = defineStore("chatbotMessage", {
    state: () => ({
        messages: [] as conversationType,//存储聊天记录
        searchGoodsData: [] as ServerSearchGoodsType,//存储搜索的商品数据
        prohibit: false,//是否禁止其他按钮
        userScrolled: false,//用户滚动过,则不再自动滚动

        //工具数据缓存
        weatherCache: {} as Record<string, CacheEntry<ServerQueryWeatherType>>,
        trainCache: {} as Record<string, CacheEntry<ServerQueryTrainTicketsType>>,
    }),
    actions: {
        //天气缓存
        async getWeatherCached(city: string): Promise<ServerQueryWeatherType> { 
            const key = weatherKey(city);
            const hit = this.weatherCache[key];
            if (hit && now() - hit.ts < TTL.weatherMs) return hit.data;
            const res = await queryWeather({ city });
            if (res.serviceCode === 200) {
                this.weatherCache[key] = { ts: now(), data: res.data };
                return res.data;
            } else {
                throw new Error(res.msg);
            }
        },
        //火车票缓存
        async getTrainTicketsCached(departure: string, destination: string, date: string): Promise<ServerQueryTrainTicketsType> { 
            const key = trainKey(departure, destination, date);
            const hit = this.trainCache[key];
            if (hit && now() - hit.ts < TTL.trainMs) return hit.data;
            const res = await queryTrainTickets({ departure, destination, date });
            if (res.serviceCode === 200) {
                this.trainCache[key] = { ts: now(), data: res.data };
                return res.data;
            } else {
                throw new Error(res.msg);
            }
        },
        //发送消息
        async sendMessage(content: sendMessageType) { 
            this.messages.push({ role: "user", content: content });
            this.messages.push({ role: "assistant", content: "", progress: true });
            this.prohibit = true;
            this.userScrolled = false;
            //搜索商品
            let userMessages = '';
            const userMessagesType = this.messages[this.messages.length - 2]?.content;
            if (typeof userMessagesType === 'string') { 
                userMessages = userMessagesType;
            } else {
                userMessages = (userMessagesType?.[0] as TextContent).text;
            }
            searchGoods({userMessage: userMessages}).then(res=>{
                console.log("搜索商品结果", res);
                this.searchGoodsData = res.data;
            });
            //请求服务器
            await chatMessageApi({ chatMessage: this.messages });
            console.log("消息发送完成");
            //对话完毕之后赋值商品数据
            this.messages[this.messages.length - 1]!["searchGoodsData"] = this.searchGoodsData;
            this.prohibit = false;
        },
        //服务器端返回消息
        async serverData(res: serverDataType) {
            let aiMessages = this.messages[this.messages.length - 1];
            if (!aiMessages) return;
            aiMessages.progress = false;
            //工具调用
            if (res.type && res.type === "function") { 
                aiMessages["type"] = "function";
                if (res.functionName === "trainTickets") {
                    const { departure, destination, date } = res.data as any;
                    aiMessages.content = `正在为您查询${date}从${departure}到${destination}的火车票信息...`;
                    // const queryRes = await queryTrainTickets({ departure: departure, destination: destination, date: date });
                    // if (queryRes.serviceCode == 200) {
                    //     aiMessages.content = `为您查询到${date}从${departure}到${destination}的火车票信息`;
                    //     aiMessages["toolData"] = queryRes.data;
                    //     aiMessages["functionName"] = "trainTickets";
                    // } else {
                    //     aiMessages.content = queryRes.msg; 
                    // }
                    const data = await this.getTrainTicketsCached(departure, destination, date);
                    aiMessages.content = `为您查询到${date}从${departure}到${destination}的火车票信息`;
                    aiMessages["toolData"] = data;
                    aiMessages["functionName"] = "trainTickets";
                    
                }
                if (res.functionName === "getWeather") { 
                    const { city } = res.data as any;
                    aiMessages.content = `正在为您查询${city}的天气信息...`;
                    // const queryRes = await queryWeather({ city: city });
                    // console.log("天气查询结果", queryRes);
                    // //考虑没有查询到
                    // if (queryRes.serviceCode == 200) {
                    //     aiMessages.content = `为您查询到${city}的天气信息`;
                    //     aiMessages["toolData"] = queryRes.data;
                    //     aiMessages["functionName"] = "getWeather";
                    // } else {
                    //     aiMessages.content = queryRes.msg; 
                    // }
                    const data = await this.getWeatherCached(city);
                    aiMessages.content = `为您查询到${city}的天气信息`;
                    aiMessages["toolData"] = data;
                    aiMessages["functionName"] = "getWeather";
                }
            }
            //没有工具调用
            if (res.type && res.type === "content") {
                aiMessages.content += res.data;
            };
        }
    },
});