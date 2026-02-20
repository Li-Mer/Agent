<template>
    <div class="content">
        <!-- 顶部区域 -->
        <IntroParagraph/>
        <!-- 默认问题 -->
        <DefaultQuestion/>  
        <!-- 对话 -->
        <ChatMessage/>
    </div>
    <!-- 底部输入框 -->
  <inputArea></inputArea>
  <div style="height: 200px"></div>
</template>
<script setup lang="ts">
import IntroParagraph from '@/page/component/introParagraph.vue';
import DefaultQuestion from '@/page/component/defaultQuestion.vue';
import ChatMessage from '@/page/component/chatMessage.vue';
import inputArea from "@/page/component/inputArea.vue";
import { watch, onMounted, ref, onUnmounted } from "vue";
import { chatbotMessage } from "@/store/index";
const store = chatbotMessage();
// import { throttle } from "lodash";
// 监听滚动，对话输出自动滚动底部
watch(
  () => store.messages,
  () => {
    //如果用户下拉页面，就不在自动滚动
    if (store.userScrolled) return;
    automatic();
  },
  { deep: true }
);
const automatic = () => {
  const contentElement = document.querySelector(".content");
  window.scrollTo({
    top: contentElement?.scrollHeight,
    behavior: "smooth",
  });
};
onMounted(() => {
  // 监听滚动事件
  window.addEventListener("scroll", throttledHandleScroll);
});
// 监听滚动方向
const lastScrollTop = ref(0);
const handleScroll = () => {
  const currentScroll = window.scrollY;
  // console.log(currentScroll);
  if (currentScroll > lastScrollTop.value) {
    // console.log("上拉");
  } else {
    console.log("下拉");
    store.userScrolled = true;
  }
  lastScrollTop.value = currentScroll;
};
// 节流
// function throttle(func:Function, delay = 300) {
//   let timer:any = null;
//   return function (...args:any[]) {
//     if (timer) return;
//     timer = setTimeout(() => {
//       func.apply(this, args);
//       timer = null;
//     }, delay);
//   };
// }
// function throttle(func: Function, delay = 300) {
//   let lastTime = 0;
//   return function (...args: any[]) {
//     const now = Date.now();
//     if (now - lastTime >= delay) {
//       func.apply(this, args);
//       lastTime = now;
//     }
//   }
// }
// lodash 风格：leading + trailing（默认行为）
function throttle<T extends (...args: any[]) => void>(func: T, wait = 300) {
  let lastInvokeTime = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const invoke = () => {
    lastInvokeTime = Date.now();
    timer = null;
    if (lastArgs) {
      func(...lastArgs);
      lastArgs = null;
    }
  };

  return (...args: Parameters<T>) => {
    const now = Date.now();
    lastArgs = args;

    const remaining = wait - (now - lastInvokeTime);

    // 够间隔了：立即执行（leading）
    if (remaining <= 0 || remaining > wait) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      invoke();
      return;
    }

    // 不够间隔：安排一次尾部执行（trailing）
    if (!timer) {
      timer = setTimeout(invoke, remaining);
    }
  };
}
const throttledHandleScroll = throttle(handleScroll, 300);
// 页面卸载时触发
onUnmounted(() => {
  window.removeEventListener("scroll", throttledHandleScroll);
});
</script>
<style scoped lang="less">
.content {
    padding:0 15px;
}
</style>