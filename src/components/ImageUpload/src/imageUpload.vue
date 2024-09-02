<!--
 * @Description:图片上传组件
 * @Author: 木鱼
 * @Date: 2022-11-05 15:56:34
 * @LastEditTime: 2023-04-04 10:08:15
 * @LastEditors: 木鱼
 * 去没人的岛 摸鲨鱼的角.
-->
<template>
  <div class="component-upload-image">
    <div>
      <!-- <Draggable
        v-if="fileList.length > 0"
        :list="fileList"
        :animation="100"
        item-key="url"
        class="list-group"
        :forceFallback="true"
        @end="onEnd"
      >
        <template #item="{ element }"> -->
          <div class="items inline-block" v-for="(element, index) in fileList" :key="index">
            <img class="img" :src="element.url" :onload="element.url" />
            <div class="img-mask">
              <EyeOutlined @click.stop="handlePreview(element)" class="mr-2"></EyeOutlined>
              <DeleteOutlined @click.stop="removeFn(element)"></DeleteOutlined>
                <!-- <c-icon type="EyeOutlined" />
                <c-icon type="DeleteOutlined" /> -->
            </div>
          </div>
        <!-- </template>
      </Draggable> -->
      <Upload
        class="custom-ant-upload"
        :multiple="multiple"
        :maxCount="count"
        :file-list="[]"
        :list-type="type"
        :before-upload="beforeUpload"
        :customRequest="uploadImage"
      >
        <div v-if="fileList.length < count">
          <PlusOutlined />
          <!-- <svg-icon icon-class="icon-uploadFile" :style="{ fontSize: '32px' }" /> -->
        </div>
      </Upload>
    </div>
    <!-- 上传提示 -->
    <div class="text-xs text-gray-400" v-if="showTip">
      <template v-if="fileSize">
        {{ t('component.upload.maxSize', [fileSize]) }}
      </template>
      <template v-if="fileType">
        {{ t('component.upload.accept', [fileType.join('/')]) }}
      </template>
    </div>
    <Modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </Modal>
    <!-- <a-modal :visible="previewVisible" :title="previewTitle" width="400px" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal> -->
  </div>
</template>

<script setup>
  import axios from 'axios';
  import { defineComponent, ref, computed, watch } from 'vue';
  import { Button, Tag, Upload, Modal } from 'ant-design-vue';
  import Draggable from 'vuedraggable-es';
  // import { getToken } from '@/utils/auth';
  import { PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { Upload as uploadApi } from '/@/api/sys/file';
  import { ResultEnum } from '/@/enums/httpEnum';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage, createErrorModal } = useMessage();
  const props = defineProps({
    // 图片数据
    value: [String, Object, Array],
    // 上传列表的内建样式暂只支持card样式， text, picture待定
    type: {
      type: String,
      default: 'picture-card',
    },
    // 是否支持多文件上传
    multiple: {
      type: Boolean,
      default: false,
    },
    // 预览标题
    previewTitle: {
      type: String,
      default: previewTitleMsg,
    },
    // 数量限制
    count: {
      type: Number,
      default: 5,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    // 上传类型
    uploadType: {
      type: Number,
      default: 0,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ['png', 'jpg', 'jpeg'],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true,
    },
  });
  const emit = defineEmits(['change']);
  const components = {
    Upload,
    PlusOutlined,
  };
  // const { proxy } = getCurrentInstance();
  const fileList = ref([]);
  const uploadList = ref([]);
  const number = ref(0);
  const previewImage = ref('');
  const previewVisible = ref(false);
  const fileUrl = ref(''); // 图片前缀
  // const uploadApi = ref('') // 上传的图片服务器地址
  // const headers = ref({ Authorization: 'Bearer ' + getToken() });
  const showTip = computed(() => props.isShowTip && (props.fileType || props.fileSize));

  watch(
    () => props.value,
    (val) => {
      if (val) {
        // 首先将值转为数组
        const list = Array.isArray(val) ? val : [];
        // 然后将数组转为对象数组
        console.log('listlist', list);
        fileList.value = list.map((item) => {
          // if (typeof item === 'string') {
          //   if (item.indexOf(fileUrl) === -1) {
          //     item = { name: fileName, url: fileUrl + item };
          //   } else {
          //     item = { name: item, url: item };
          //   }
          // }
          item = {
            id: item.id,
            url: item.imageCheckUrl || item.url,
            name: item.fileName,
          };
          return item;
        });
      } else {
        fileList.value = [];
        return [];
      }
    },
    { deep: true, immediate: true },
  );

  /**
   * @description: 图片加载中，在加载完成时触发
   * @param {*} url 上传的图片地址
   * @return {*} 上传的图片地址
   */
  const onLoadImg = (url) => {
    return url;
  };
  /**
   * @description: 图片加载失败
   * @param {*} event
   * @return {*} 图片加载失败默认图片
   */
  // const useDefaultImage = event => {
  //   event.target.src = proxy.getAssetsFile('loadError.png');
  // };

  /**
   * @description: 拖拽结束的事件
   * @return {*} 返回图片相对路径
   */
  const onEnd = () => {
    emit('change', fileList.value);
  };

  /**
   * @description: 删除按钮
   * @param {*} file 删除的文件
   * @return {*}
   */
  const removeFn = (file) => {
    const findex = fileList.value.map((f) => f.id).indexOf(file.id);
    if (findex > -1 && uploadList.value.length === number.value) {
      fileList.value.splice(findex, 1);
      emit('change', fileList.value);
      return false;
    }
  };

  /**
   * @description: 上传前状态
   * @param {*} file 上传文件
   * @return {*}
   */
  const beforeUpload = (file) => {
    return new Promise((resolve, reject) => {
      let fileExtension = '';
      if (file.name.lastIndexOf('.') > -1) {
        fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1);
      }
      // 文件类型(file.type)
      console.log('fileExtension',fileExtension);
      console.log('props.fileType',props.fileType);
      console.log('file.type',file.type);
      const isTypeOk = props.fileType.some((type) => {
        if (file.type.indexOf(type) > -1) return true;
        if (fileExtension && fileExtension.indexOf(type) > -1) return true;
        return false;
      });
        console.log('isTypeOk',isTypeOk);
      if (!isTypeOk) {
        createErrorModal({
          title:t('sys.api.errorTip'),
          content:t('component.upload.accept', [props.fileType.join('/')])
        });
        return false;
      }
      // 大小限制(file.size)
      const isLt2M = file.size / 1024 / 1024 < props.fileSize;
      if (!isLt2M) {
        createErrorModal({
          title:t('sys.api.errorTip'),
          content:t('component.upload.maxSize', [props.fileSize])
        });
        return reject(false);
      }
      number.value++;
      resolve(isTypeOk, isLt2M);
    });
  };
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  /**
   * @description: 上传成功
   * @param {*} info  file fileList event
   * @return {*}
   */
  const uploadImage = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    let formData = new FormData();
    formData.append('file', file);
    formData.append('uploadType', props.uploadType);
    onProgress({ percent: 80 });
    try {
      uploadApi({ file }).then(async (res) => {
        if (res.status !== 200) {
          onError(res?.data?.data, file);
          return createMessage.error(t('component.upload.uploadError'));
        } else {
          if (res?.data?.code != ResultEnum.SUCCESS1) {
            return createMessage.error(`${res.data.data.msg}`);
          }
        }
        onProgress({ percent: 100 });
        onSuccess(res?.data?.data, file);
        const { id, fileName, fileUrl } = res?.data?.data;
        const imageCheckUrl = await getBase64(file);
        uploadList.value.push({ id, name: fileName, imageCheckUrl: imageCheckUrl });
        uploadedSuccessfully();
      });
    } catch (error) {
      console.log(`上传文件出错`, error);
    }
  };
  /**
   * @description: 上传结束处理
   * @return {*}
   */
  const uploadedSuccessfully = () => {
    if (number.value > 0 && uploadList.value.length === number.value) {
      fileList.value = fileList.value.filter((f) => f.url !== undefined).concat(uploadList.value);
      uploadList.value = [];
      number.value = 0;
      // emit('change', listToString(fileList.value));
      emit('change', fileList.value);
    }
  };
  /**
   * @description: 预览图片-开启
   * @param {*} file 预览图片
   * @return {*}
   */
  const handlePreview = (file) => {
    previewImage.value = file.url;
    previewVisible.value = true;
  };

  /**
   * @description: 预览弹窗 关闭
   * @return {*}
   */
  const handleCancel = () => {
    previewVisible.value = false;
  };

  /**
   * @description: 对象转成指定字符串分隔
   * @param {*} files 转换文件数组
   * @param {*} separator 对象转成指定字符串分隔 例如 ","
   * @return {*} 指定分隔符 分隔的字符串
   */
  const listToString = (files, separator) => {
    let list = toRaw(files);
    let strs = '';
    separator = separator || ',';
    for (let i in list) {
      if (undefined !== list[i].url && list[i].url.indexOf('blob:') !== 0) {
        strs += list[i].url.replace(fileUrl.value, '') + separator;
      }
    }
    return strs != '' ? strs.substr(0, strs.length - 1) : '';
  };
</script>
<script>
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
const previewTitleMsg = t('component.upload.preview');
export default {}
</script>
<style lang="scss" scoped>
  /* .custom-ant-upload :deep(.ant-upload.ant-upload-select-picture-card) {
  width: 64px !important;
  height: 64px !important;
  margin: 8 !important;
} */
  .list-group {
    display: flex;
    padding: 8px;
  }
  .items {
    position: relative;
    width: 104px;
    height: 104px;
    margin: 0 8px 8px 0;
    border-radius: 8px;
  }
  .img {
    width: 104px;
    height: 104px;
    border-radius: 8px;
  }
  .img-mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .img-mask:hover {
    opacity: 1;
  }
</style>
