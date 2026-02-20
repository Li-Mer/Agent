 <template>
  <div class="input-container">
    <!-- 图片上传展示 -->
    <van-uploader class="upload-image" v-model="fileList" :max-count="1" preview-size="60" disabled v-if="showImage" :before-delete="beforeDelete"/>
    <div class="data-query" v-if="!showImage">
      <div style="display: inline-block"><van-button size="small" type="default" :disabled="store.prohibit" @click="inquire('帮我查询火车票')">查询火车票</van-button></div>
      <div style="display: inline-block"><van-button size="small" type="default" :disabled="store.prohibit" @click="inquire('帮我查询天气')">查询天气</van-button></div>
      <van-uploader  name="file" :before-read="beforeRead" :after-read="afterRead">
        <van-button size="small" type="default" :disabled="store.prohibit">图片问答</van-button>
      </van-uploader>
      <div style="display: inline-block"><van-button size="small" type="default" :disabled="store.prohibit" @click="sendComplaint">一键投诉</van-button></div>
    </div>
    <div class="input-box-area">
      <img src="@/assets/qingchu.png" alt=""  @click="remove"/>
      <van-field class="input-content"  type="textarea" placeholder="请输入询问内容" :border="false" v-model="inputContent"></van-field>
      <van-button class="send-button" size="small" type="default" :disabled="store.prohibit" @click="sendMessage" >发送</van-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

import { chatbotMessage } from '@/store/index';
import { showToast,showLoadingToast} from 'vant';
import type { UploaderBeforeRead, UploaderAfterRead } from 'vant';
import { uploadFile } from '@/api/request';
const store = chatbotMessage();

//图片压缩
const compressImage = async (file: File, maxWidth = 1000, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // 允许跨域图片处理（如果需要）
    img.crossOrigin = 'anonymous';
    // 读取文件并加载到img
    img.onload = () => {
      // 计算压缩后的尺寸（按比例缩放）
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
      }

      // 创建canvas并绘制图片
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('canvas上下文创建失败'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      // 将canvas转为Blob（压缩质量控制）
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('图片压缩失败'));
          }
        },
        'image/jpeg', // 可选：'image/webp' 压缩率更高（兼容性稍差）
        quality // 质量参数：0-1，越小压缩率越高
      );
    };
    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = URL.createObjectURL(file);
  });
};

const showImage = ref(false);
const fileList = ref([{
  url: '',
}]);


//上传之前校验
const beforeRead:UploaderBeforeRead = (file:any) => {
  const imageType = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (!imageType.includes(file.type)) {
    showToast('上传图片格式不支持');
    return false;
  }
  return true;
}
//原上传成功时触发
// const afterRead: UploaderAfterRead = async (file: any) => {
//   const toast = showLoadingToast({
//     message: '图片上传中...',
//     duration: 0,
//     forbidClick: true,
//   });
//   const formData = new FormData();
//   formData.append('file', file.file);
//   const res = await uploadFile(formData);
//   console.log("上传图片返回的结果", res);
//   if (fileList.value && fileList.value.length > 0 && fileList.value[0]) {
//     // fileList.value[0].url = "http://" + res.data;
//     fileList.value[0].url = res.data;
//   } else {
//     // fileList.value = [{ url: "http://" + res.data }];
//     fileList.value = [{ url: res.data }];
//   }
//   showImage.value = true;
//   toast.close();
// }
//修改后上传成功时触发（添加图片压缩功能）
const afterRead: UploaderAfterRead = async (file: any) => {
  const toast = showLoadingToast({
    message: '图片上传中...',
    duration: 0,
    forbidClick: true,
  });
  try {
    // 1. 先压缩图片（限制最大宽度1000px，质量0.8）
    const compressedBlob = await compressImage(file.file, 1000, 0.8);
    // 2. 将压缩后的Blob转为File对象（保持文件名）
    const compressedFile = new File([compressedBlob], file.file.name, {
      type: 'image/jpeg',
    });
    const formData = new FormData();
    formData.append('file', compressedFile);
    const res = await uploadFile(formData);
    if (fileList.value && fileList.value.length > 0 && fileList.value[0]) {
      // fileList.value[0].url = "http://" + res.data;
      fileList.value[0].url = res.data;
    } else {
      // fileList.value = [{ url: "http://" + res.data }];
      fileList.value = [{ url: res.data }];
    }
    showImage.value = true;
  } catch (error) {
    showToast('图片处理失败，请重试');
    console.error('图片压缩/上传错误：', error);
  } finally {
    toast.close();
  }
}
//删除图片
const beforeDelete = () => {
  showImage.value = false;
  fileList.value = [];
  return true;
};

//输入内容
const inputContent = ref('')
const sendMessage = () => {
  if (!inputContent.value.trim()) {
    showToast('请输入内容或上传图片');
    return;
  }
  store.sendMessage(
    !showImage.value ? inputContent.value : [
      {
        type: 'text',
        text: inputContent.value,
      },
      {
        type: 'image_url',
        image_url: {
          url: fileList.value[0]!.url,
        },
      }
    ],
  );
  beforeDelete();
  inputContent.value = ''
};
const inquire = (text: string) => {
  inputContent.value = text;
  store.sendMessage(text);
};
const remove = () => {
  if(store.prohibit){
    // showToast('当前有未完成的请求，无法清空对话');
    return;
  }
  store.messages = [];
}
//一键投诉
import {useRouter} from 'vue-router';
const router = useRouter();
const sendComplaint = () => {
  router.push({ path: '/complaintPage' });
};

</script>
<style scoped lang="less">
.input-container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  .upload-image {
    margin-left: 15px;
  }
  /deep/.van-uploader__wrapper--disabled {
    opacity: inherit;
    .van-uploader__preview {
      background-color: #ffffff;
    }
  }
  .data-query {
    display: flex;
    align-items: center;
    .van-button {
      margin-left: 15px;
      margin-bottom: 5px;
      opacity: 1;
    }
  }
  .input-box-area {
    background-color: #ffffff;
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    padding-top: 5px;
    img {
      width: 27px;
      height: 27px;
      margin: 0 10px;
    }
    .input-content {
      background-color: #f8f9fd;
      flex: 1;
      border-radius: 10px;
      padding: 6px;
    }
    .send-button {
      border: none;
      font-size: 15px;
      color: #3a71e8;
      font-weight: bold;
      margin: 0 5px;
    }
  }
}
</style>