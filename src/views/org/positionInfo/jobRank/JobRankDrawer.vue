<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, Rule, useForm } from '/@/components/Form';
  import { formSchema } from './jobRank.data';
  import { saveInfo,updateInfo } from '/@/api/org/jobRank';
  import { getPositionInfoList } from '/@/api/org/positionInfo';
  import { useI18n } from '/@/hooks/web/useI18n';
  export default defineComponent({
    name: 'JobRankDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const isUpdate = ref(true);

      const [registerForm, { resetFields, updateSchema,clearValidate, setFieldsValue, validate }] = useForm({
        labelWidth: 120,
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        await resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        let formData = data.record;
        console.log('formData',formData)
        let options = await getPositionInfoList({
          status:1,
          gradeId:formData?.gradeId
        })
        await updateSchema([
          {
            field:'positionId',
            componentProps:{
              options,
              fieldNames: {
                label:'positionName',
                value:'id'
              },
              onChange: async (...arrg) => {
                console.log('...arrg...arrg',...arrg)
                let e = arrg[0]
                let positionInfo = arrg[2]
                let positionCode = positionInfo?.triggerNode?.props?.positionCode
                await setFieldsValue({
                  positionCode: e ? positionCode : ''
                });
              }
            },
          }
        ])
        await setFieldsValue({
          ...data.record,
        });
      });

      const getTitle = computed(() =>
        !unref(isUpdate) ? t('common.addText') + ' ' + t('views.components.rankCategory') : t('common.updateText') + ' ' + t('views.components.rankCategory'),
      );

      async function handleSubmit() {
        try {
          setDrawerProps({ confirmLoading: true });
          const values = await validate();
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
