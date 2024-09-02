<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="title" @ok="handleSubmit" width="600px">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { rules } from '/@/utils/helper/validator';
  import { defHttp } from '/@/utils/http/axios';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import BasicForm from '/@/components/Form/src/BasicForm.vue';
  import { useForm } from '/@/components/Form/src/hooks/useForm';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useLocaleStore } from '/@/store/modules/locale';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ResultEnum } from '/@/enums/httpEnum';
  const localeStore = useLocaleStore();
  const { t } = useI18n();
  // 声明Emits
  const emit = defineEmits(['register']);
  const $message = useMessage();
  const formRef = ref();
  const userId = ref('');
  // update-begin--author:liaozhiyang---date:20240124---for：【QQYUN-7970】国际化
  const title = ref(t('sys.login.updateFormTitle'));
  //表单配置
  const [registerForm, { resetFields, validate, clearValidate }] = useForm({
    schemas: [
      {
        label: t('sys.login.oldPassword'),
        field: 'nowPassword',
        component: 'InputPassword',
        required: true,
      },
      {
        label: t('sys.login.newPassWord'),
        field: 'newPassword',
        component: 'StrengthMeter',
        required: true,
      },
      {
        label: t('sys.login.confirmPassword'),
        field: 'confirmpassword',
        component: 'InputPassword',
        required: true,
        dynamicRules: ({ values }) => rules.confirmPassword(values, true),
      },
    ],
    showActionButtonGroup: false,
    wrapperCol: null,
    labelWidth: localeStore.getLocale == 'zh_CN' ? 100 : 160,
  });
  // update-end--author:liaozhiyang---date:20240124---for：【QQYUN-7970】国际化
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(data => {
    userId.value = data.record.id
  });

  //表单提交事件
  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      //提交表单
      let params = Object.assign({ userId: unref(userId) }, values);
      defHttp.put({ url: '/user/updatePwd', params,headers:{
        'content-type':'application/x-www-form-urlencoded;charset=UTF-8'
      }
       }, { isTransformResponse: false }).then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          $message.createMessage.success(res.message);
          //关闭弹窗
          closeModal();
        } else {
          $message.createMessage.warning(res.message);
        }
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  async function show(id) {
    console.log('idid',id)
    userId.value = id;
    await setModalProps({ visible: true });
    await resetFields();
    await clearValidate();
  }

  defineExpose({
    title,
    show,
  });
</script>
