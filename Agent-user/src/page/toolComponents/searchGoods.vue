<template>
  <div style="height: 4px"></div>
  <div class="goods-content">
    <p class="title">为你推荐以下相关的旅行套餐，官方严选:</p>
    <div class="goods-list">
      <div class="goods-item" v-for="(item, index) in SearchGoodsData" :key="index" @click="goToUrl(item._id)">
        <img :src="item.coverImage" alt="" />
        <p class="goods-title text-show">{{ item.contentTitle }}</p>
        <p class="goods-price">¥{{ item.price }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ServerSearchGoodsType } from "@/types/index";
import { useRouter } from "vue-router";
const $router = useRouter();
defineProps<{
  SearchGoodsData: ServerSearchGoodsType;
}>();
const goToUrl = (id: string) => {
  $router.push({ path: "/goodsDetails", query: { id } });
};
</script>
<style scoped lang="less">
.goods-content {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 7px;
  .title {
    color: darkorchid;
    font-weight: bold;
  }
  .goods-list {
    overflow-x: auto;
    display: flex;
    gap: 7px;
    padding-top: 7px;
    .goods-item {
      width: 130px;
      background: #f3f3f3;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      img {
        width: 100%;
        height: 140px;
        object-fit: cover;
        border-radius: 4px;
      }
      .goods-title {
        font-size: 15px;
        font-weight: bold;
        line-height: 1.4;
        margin: 6px;
      }
      .goods-price {
        padding: 0 6px 6px 6px;
        color: red;
        font-weight: bold;
        margin-top: auto;
      }
    }
  }
}
</style>