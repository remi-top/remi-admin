<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, Rule, useForm } from '/@/components/Form';
  import { formSchema } from './positionInfo.data';
  import { saveInfo,updateInfo, checkEntityExist } from '/@/api/org/positionInfo';
  import {CheckExistParams} from "/@/api/model/baseModel";
  import { useI18n } from '/@/hooks/web/useI18n';
  export default defineComponent({
    name: 'PositionInfoDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const isUpdate = ref(true);

      const [registerForm, { resetFields, setFieldsValue,updateSchema, validate }] = useForm({
        labelWidth: 120,
        schemas: formSchema,
        showActionButtonGroup: false,
      });


      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        await resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        let formData = data.record;
        setFieldsValue({
          ...data.record,
        });
        await updateSchema([
          {
            field:'gradeId',
            onChange: async (...arrg) => {
              console.log('...arrg...arrg',...arrg)
              let e = arrg[0]
              let gradeInfo = arrg[2]
              let gradeCode = gradeInfo?.triggerNode?.props?.gradeCode
              await setFieldsValue({
                gradeCode: e ? gradeCode : ''
              });
            }
          }
        ])
      });

      const getTitle = computed(() =>
        !unref(isUpdate) ? t('common.addText') + ' ' + t('views.components.posts') : t('common.updateText') + ' ' + t('views.components.posts'),
      );

      async function handleSubmit() {
        try {
          setDrawerProps({ confirmLoading: true });
          const values = await validate();
          values.status = values.status ? 1 : 0
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
