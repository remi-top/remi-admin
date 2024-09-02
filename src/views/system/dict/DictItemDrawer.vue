<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, Rule, useForm } from '/@/components/Form/index';
  import { formSchema } from './dictItem.data';
  import { saveInfo, updateInfo } from '/@/api/system/dictItem/dictItem';
  import { Upload } from 'ant-design-vue';
  import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
export default defineComponent({
  name: 'DictItemDrawer',
  components: { BasicDrawer, BasicForm, PlusOutlined, LoadingOutlined, Upload },
  emits: ['success', 'register'],
  setup(_, { emit }) {
      const { t } = useI18n();
      const isUpdate = ref(true);
      const imageUrl = ref<string>('');

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 140,
        schemas: formSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer, changeLoading }] = useDrawerInner(async (data) => {
        console.log('datadatadata',data)
        changeLoading(true);
        resetFields();
        isUpdate.value = !!data?.isUpdate;
        await setFieldsValue({
          ...data.record,
        });
        changeLoading(false);
      });

      const getTitle = computed(() =>
        !unref(isUpdate) ? t('common.addText') + ' ' + t('views.components.dictItem') : t('common.updateText') + ' ' + t('views.components.dictItem'),
      );
      async function handleSubmit() {
        try {
          setDrawerProps({confirmLoading: true});
          const values = await validate();
          const api = !unref(isUpdate) ? saveInfo : updateInfo
          await api(values);
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        registerDrawer,
        registerForm,
        getTitle,
        imageUrl,
        handleSubmit,
      };
    },
  });
</script>