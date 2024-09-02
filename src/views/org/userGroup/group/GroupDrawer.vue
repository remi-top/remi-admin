<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, Rule, useForm } from '/@/components/Form';
  import { formSchema } from './groupInfo.data';
  import { saveInfo,updateInfo } from '/@/api/org/group';
  import { useI18n } from '/@/hooks/web/useI18n';
  export default defineComponent({
    name: 'GroupInfoDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const isUpdate = ref(true);

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 120,
        schemas: formSchema,
        showActionButtonGroup: false,
      });


      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        await resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        // if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          });
        // }
      });

      const getTitle = computed(() =>
        !unref(isUpdate) ? t('common.addText') + ' ' + t('views.components.userGroup') : t('common.updateText') + ' ' + t('views.components.userGroup'),
      );

      async function handleSubmit() {
        try {
          setDrawerProps({ confirmLoading: true });
          const values = await validate();
          values.status = values.status ? 1 : 0
          values.parentId = values.parentId ? values.parentId : 0
          const api = !unref(isUpdate) ? saveInfo : updateInfo
          await api(values);
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { registerDrawer, registerForm, getTitle, handleSubmit };
    },
  });
</script>
