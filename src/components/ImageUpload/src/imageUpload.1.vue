<template>
  <div class="clearfix" v-loading="loading">
    <Upload
      v-model:file-list="fileList"
      list-type="picture-card"
      :max-count="maxCount"
      @preview="handlePreview"
      :before-upload="beforeUpload"
      :showUploadList="{ showRemoveIcon: !isPreview }"
      @change="handleChange"
      accept= ".jpg,.png"
    >
      <div v-if="!isPreview">
        <plus-outlined />
        <div style="margin-top: 8px">添加图片</div>
      </div>
    </Upload>
    <Modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </Modal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, watch } from 'vue';
  import { BasicModal } from '/@/components/Modal';
  import { previewProps } from './props';
  import { Button, Tag, Upload, Modal } from 'ant-design-vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import type { UploadProps } from 'ant-design-vue';
  import { Upload as uploadApi,fileInfo } from '/@/api/sys/file';
import { isArray } from '@vue/shared';
import { useMessage } from '/@/hooks/web/useMessage';
export default defineComponent({
  name: 'ImageUpload',
  props: previewProps,
  components: { BasicModal, PlusOutlined, Modal, Button, Upload, Tag },
  emits: ['change','update:value'],
  setup(props, { emit }) {
      const { createMessage } = useMessage();
      const previewVisible = ref(false);
      const maxCount = ref<number | string | null>(null);
      const previewImage = ref('');
      const title = ref('');
      const previewTitle = ref('');
      const isPreview = ref(true);
      const loading = ref(false);
      const fileList = ref<fileInfo[]>([]);
      const getTitle = computed(() => title.value);
      watch(
        () => props.value,
        (value) => {
          console.log('ImageUpload', value);
          if (!isArray(value)) {
            fileList.value = [];
          } else {
            fileList.value = value
              .filter((item) => !!item)
              .map((item) => {
                return {
                  id: item.id,
                  url: item.imageCheckUrl,
                  fileName: item.fileName,
                };
              });
          }
        },
        { immediate: true },
    );
    watch(
        () => props.maxCount,
        (value) => {
          console.log(value, 'valuevaluevalue');
          maxCount.value = value;
        },
        { immediate: true },
      );
      watch(
        () => props.isPreview,
        (value) => {
          console.log(value, 'valuevaluevalue');

          isPreview.value = value;
        },
        { immediate: true },
      );

      function getBase64(file: File) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      }
      const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          createMessage.error("只允许上传图片！");
          return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
          createMessage.error("图片不能大于10MB！");
          return false;
        }
        loading.value = true;
        const imageCheckUrl = await getBase64(file);
        const { data } = await uploadApi({ file: file })
        if (data?.data) {
          let fileItem = data.data;
          // return resolve(true)
          // console.log('uploadApi-data', data, file);
          const fileObj = {
            ...file,
            imageCheckUrl,
            originFileObj: file,
            type: file.type,
            uid: file.uid,
            size: file.size,
            id: fileItem.id
          }
          fileList.value.push(fileObj)
          // const a = {
          // emit('update:value', fileList.value);
          emit('change', fileList.value);
          loading.value = false;
          return false;
        } else {
          loading.value = false;
          return false;
        }
      };

      const handleChange = () => {
        // emit('update:value', fileList.value);
        emit('change', fileList.value);
      };

      const handleCancel = () => {
        previewVisible.value = false;
        previewTitle.value = '';
      }
      const handlePreview = async (file: UploadProps['fileList'][number]) => {
        if (!file.url && !file.preview) {
          file.preview = (await getBase64(file.originFileObj)) as string;
        }
        previewImage.value = file.url || file.preview;
        previewVisible.value = true;
        previewTitle.value = file.fileName || file.url.substring(file.url.lastIndexOf('/') + 1);
      };

    return {
        maxCount,
        loading,
        isPreview,
        beforeUpload,
        getTitle,
        previewVisible,
        previewImage,
        fileList,
        handleCancel,
        handlePreview,
        // handleDelete,
        handleChange,
        previewTitle,
      };
    },
  });
</script>
<style lang="less" scoped>
  /deep/ .ant-upload-list {
    > div {
      width: 120px !important;
      height: 120px !important;
    }
  }
</style>
