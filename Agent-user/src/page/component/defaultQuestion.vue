<template>
    <div class="support-agent">
        <img src="@/assets/kefu.png" alt="" style="border-radius: 50%;">
        <p>云游宝</p>
    </div>
    <div class="customer-service">
        <span class="tips">你可以这样问我</span>
        <div class="customer-service-list" v-for="(item, index) in displayedList" :key="index" @click="selectSend(item)">
        <img src="@/assets/wenti.png" alt="" />
        <p>{{ item }}</p>
        </div>
    </div>
    <div class="change-section" @click="switchMode">
        <img src="@/assets/huanyihuan.png" alt="" />
        <p>换一换</p>
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { chatbotMessage } from "@/store/index";
const store = chatbotMessage();
// 默认问题
const customerServiceList = ref([
  "哀牢山可以进入探险旅游吗",
  "大理古城有哪些夜市可以逛",
  "昆明滇池可以坐游艇吗",
  "带着家人到丽江旅游三天,帮我规划一个行程吧",
  "在云南旅游遇到黑导游怎么办",
  "怎样前往玉龙雪山？",
  "丽江古城有哪些必去的景点？",
  "云南有哪些著名的民族村落？",
  "如何品尝正宗的云南过桥米线？",
  "在大理周边有哪些值得一游的小镇？",
  "云南有哪些著名的茶叶品种？",
  "怎样体验云南的民俗文化？",
  "在香格里拉有哪些不容错过的活动？",
  "云南有哪些适合徒步的景点？",
  "云南有哪些适合拍婚纱照的景点？",
]);
const currentIndex = ref(0);
const displayedList = computed(() => {
  return JSON.parse(JSON.stringify(customerServiceList.value)).splice(currentIndex.value, 5)
})
const switchMode = () => {
  currentIndex.value += 5;
  if (currentIndex.value >= customerServiceList.value.length) {
    currentIndex.value = 0;
  }
};

const selectSend = (text: string) => {
  store.sendMessage(text);
};
</script>
<style scoped lang="less">
.support-agent {
    display: flex;
    align-items: center;
    img {
        width: 35px;
        height: 35px;
        margin-right: 8px;
    }
    p {
        font-size: 14px;
        color: #333333;
        margin: 0;
    }
}
.customer-service {
   background-color: #ffffff;
   margin:10px 0;
   padding: 10px;
   border-top-right-radius: 10px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    .tips{
        font-size: 16px;
    }
     .customer-service-list {
    display: flex;
    align-items: center;
    background-color: #f2f4ff;
    border-radius: 40px;
    margin-top: 10px;
    padding: 5px 7px;
    img {
      width: 25px;
      height: 25px;
      object-fit: cover;
    }
    p {
      font-size: 14px;
      padding-left: 4px;
    }
  }
}
.change-section {
  display: inline-flex;
  align-items: center;
  background-color: #a8abb0;
  border-radius: 40px;
  padding: 4px 7px;
  img {
    width: 20px;
    height: 20px;
  }
  p {
    font-size: 14px;
    padding-left: 7px;
    color: #ffffff;
  }
}
</style>