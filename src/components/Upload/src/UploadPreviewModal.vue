<template>
  <BasicModal
    width="800px"
    :title="t('component.upload.preview')"
    class="upload-preview-modal"
    v-bind="$attrs"
    @register="register"
    :showOkBtn="false"
  >
    <FileList :dataSource="fileListRef" :columns="columns" :actionColumn="actionColumn" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, watch,computed, ref } from 'vue';
  //   import { BasicTable, useTable } from '/@/components/Table';
  import FileList from './FileList.vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { previewProps } from './props';
  import { PreviewFileItem } from './typing';
  import { downLoadApi } from '/@/api/sys/upload';
  import { downloadByData } from '/@/utils/file/download';
  import { createPreviewColumns, createPreviewActionColumn } from './data';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isArray } from '/@/utils/is';

  export default defineComponent({
    components: { BasicModal, FileList },
    props: previewProps,
    emits: ['list-change', 'register', 'delete'],
    setup(props, { emit }) {
      let showDeleteBtnEnd = ref(false)
      const [register, { closeModal, changeLoading }] = useModalInner((data) => {
        const { showDeleteBtn } = data
        showDeleteBtnEnd.value = showDeleteBtn
      });
      const { t } = useI18n();

      const fileListRef = ref<PreviewFileItem[]>([]);
      watch(
        () => props.value,
        (value) => {
          if (!isArray(value)) value = [];
          fileListRef.value = value
            .filter((item) => !!item)
            .map((item) => {
              return {
                url: item.fileUrl,
                type: item.fileUrl?.split('.').pop() || '',
                name: item.fileName,
              };
            });
        },
        { immediate: true },
      );

      // 删除
      function handleRemove(record: PreviewFileItem) {
        const index = fileListRef.value.findIndex((item) => item.url === record.url);
        if (index !== -1) {
          const removed = fileListRef.value.splice(index, 1);
          emit('delete', removed[0].url);
          emit(
            'list-change',
            fileListRef.value.map((item) => item.url),
          );
        }
      }

      // // 预览
      // function handlePreview(record: PreviewFileItem) {
      //   const { url = '' } = record;
      //   createImgPreview({
      //     imageList: [url],
      //   });
      // }

      // 下载
      async function handleDownload(record: PreviewFileItem) {
        const { url = '' ,name=''} = record;
        changeLoading(true)
        const data = await downLoadApi({ objectName: url });
        if (data) {
          downloadByData(data,name)
        } else {
          
        }
        changeLoading(false)
      }

      const actionColumn = computed(() => {
        return createPreviewActionColumn({ handleRemove, handleDownload,showDeleteBtn:showDeleteBtnEnd.value})
      })

      return {
        t,
        register,
        closeModal,
        fileListRef,
        columns: createPreviewColumns() as any[],
        actionColumn,
      };
    },
  });
</script>
<style lang="less">
  .upload-preview-modal {
    .ant-upload-list {
      display: none;
    }

    .ant-table-wrapper .ant-spin-nested-loading {
      padding: 0;
    }
  }
</style>
