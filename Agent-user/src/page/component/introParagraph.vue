<template>
    <div class="main-header">
    <div>
      <p class="name-field">Hi,我是云游宝</p>
      <p class="intro-section">你的专属旅游助手,可以帮助你规划行程和解答出游问题哦！</p>
    </div>
    <div>
      <img src="@/assets/intro-section.png" alt="" />
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped lang="less">
.main-header {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 30px 0;
  img {
    width: 100%;
    object-fit: fill;
  }
  .name-field {
    font-size: 20px;
    color: #4d7cd6;
    font-family: "NAME";
  }
  .intro-section {
    font-weight: bold;
    line-height: 2;
  }
}
</style>