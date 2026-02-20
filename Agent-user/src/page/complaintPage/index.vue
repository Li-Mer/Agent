<template>
  <van-nav-bar title="投诉" left-arrow fixed placeholder @click-left="onClickLeft" />
  <div class="complaint-page">
    <p class="title-text">你要投诉谁</p>
    <van-field is-link readonly placeholder="选择投诉对象" v-model="selectResult.complaintTarget" @click="showPicker = true" />
    <van-popup :show="showPicker" round position="bottom">
      <van-picker :columns="objectData" @cancel="showPicker = false" @confirm="selectedObject" />
    </van-popup>
  </div>
  <div class="complaint-page">
    <p class="title-text">请告诉我们发生了什么事</p>
    <van-field type="textarea" v-model="selectResult.complaintReason" class="input-content" placeholder="输入投诉原因" />
  </div>
  <div class="complaint-page">
    <p class="title-text">这件事发生在哪里</p>
    <van-field is-link readonly placeholder="选择地区" @click="showPickerCity = true" v-model="selectResult.location" />
    <van-popup :show="showPickerCity" round position="bottom">
      <van-picker :columns="cityData" @cancel="showPickerCity = false" @confirm="selectedRegion" />
    </van-popup>
  </div>
  <div class="complaint-page">
    <p class="title-text">你的诉求是</p>
    <van-field type="textarea" class="input-content" v-model="selectResult.appeal" placeholder="点击输入处理诉求" />
  </div>
  <div class="complaint-page">
    <p class="title-text">最后，我们需要了解您的个人信息，用于核实事件以及告知您处理结果</p>
    <van-field label="你的姓名" placeholder="请输入姓名" v-model="selectResult.userName" />
    <van-field label="你的联系方式" type="tel" placeholder="请输入电话号码" v-model="selectResult.phoneNumber" />
    <van-field is-link readonly placeholder="你在云南是如何旅行的" @click="showPickerTrave = true" v-model="selectResult.travelMethod" />
    <van-popup :show="showPickerTrave" round position="bottom">
      <van-picker :columns="travelMethodData" @cancel="showPickerTrave = false" @confirm="selectedTravelMode" />
    </van-popup>
  </div>
  <van-button class="submit-button" type="primary" @click="subMit">提交投诉单</van-button>
  <div style="height: 150px"></div>
</template>
<script setup lang="ts">
import { ref,reactive } from 'vue';
import { cityData } from '@/config/city'
import { showToast, showLoadingToast } from "vant";
import { addComplaint } from "@/api/request";

const objectData = ref([
  {
    text: "投诉旅行社",
    value: "001",
  },
  {
    text: "投诉导游",
    value: "002",
  },
  {
    text: "投诉商家",
    value: "003",
  },
  {
    text: "投诉景区",
    value: "004",
  },
]);
const travelMethodData = ref([
  {
    text: "自由行",
    value: "001",
  },
  {
    text: "跟团游",
    value: "002",
  },
  {
    text: "半自助游",
    value: "003",
  },
]);
const showPicker = ref(false);
// 选择投诉对象
const selectedObject = ({ selectedOptions }: any) => {
  selectResult.complaintTarget = selectedOptions[0].text;
  showPicker.value = false;
};
const showPickerCity = ref(false);
// 选择地区
const selectedRegion = ({ selectedOptions }: any) => {
  console.log(selectedOptions);
  selectResult.location = "";
  selectedOptions.forEach((item: any) => {
    selectResult.location += item.text;
  });
  showPickerCity.value = false;
};
const showPickerTrave = ref(false);
// 选择旅行方式
const selectedTravelMode = ({ selectedOptions }: any) => {
  selectResult.travelMethod = selectedOptions[0].text;
  showPickerTrave.value = false;
};
// 存储选择的数据
const selectResult = reactive({
  complaintTarget: "",
  complaintReason: "",
  location: "",
  appeal: "",
  userName: "",
  phoneNumber: "",
  travelMethod: "",
});
const subMit = async () => {
  console.log(selectResult);
  showLoadingToast({
    message: "提交中...",
    forbidClick: true,
    duration: 0,
  });
  await addComplaint(selectResult);
  showToast("提交成功");
  history.back();
};
const onClickLeft = () => history.back();
</script>
<style scoped>
.complaint-page {
  padding: 10px;
  .title-text {
    padding-bottom: 10px;
    font-weight: bold;
  }
  .input-content {
    background-color: #f8f9fd;
    border-radius: 10px;
    padding: 6px;
  }
}
.submit-button {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  margin: 10px;
}
</style>