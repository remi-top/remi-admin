<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('sys.login.updateFormTitle')" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { formSchema } from '../components/index';
  // import { UpdateUserPassWord } from '/@/api/sys/user';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  const userStore = useUserStoreWithOut();
  export default defineComponent({
    name: 'CompanyModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const [registerForm, { resetFields, validate }] = useForm({
        labelWidth: 120,
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await resetFields();
        setModalProps({ confirmLoading: false });
      });

      async function handleSubmit() {
        try {
          setModalProps({ confirmLoading: true });
          const values = await validate();
          // await UpdateUserPassWord({...values,userCode:userStore.userInfo?.userCode});
          closeModal();
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, handleSubmit,t };
    },
  });
</script>
