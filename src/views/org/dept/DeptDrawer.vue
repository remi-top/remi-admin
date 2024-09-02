<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" >
      <template #settingLeader="{ model, field }">
        <Tag v-if="model[field]" closable @close="handleDeleteLeader">
          {{model['deptHeadName']}}[{{model['deptHeadCode']}}]
        </Tag>
        <Button style="width: 110px" type="link" @click="handleSettingLeader">{{t('views.dept.settingLeader')}}</Button>
      </template>
    </BasicForm>
    <PersonalSelector @register="registerPersonalDrawer"  @success="handleSettingLeaderSuccess"/>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, Rule, useForm } from '/@/components/Form/index';
  import { deptFormSchema } from './dept.data';
  import { saveInfo, updateInfo,checkEntityExist } from '/@/api/org/dept';
  import { getCompanies,getInfo } from '/@/api/org/company';
  import { useDrawer } from '/@/components/Drawer';
  import { Tag } from 'ant-design-vue';
  import { Button } from '/@/components/Button'
  import PersonalSelector from '/@/views/components/selector/personalSelector/index.vue';
  import { CheckExistParams } from "/@/api/model/baseModel";
  import {CompanyInfo} from "/@/api/org/model/companyModel";
  import { useI18n } from '/@/hooks/web/useI18n';
  export default defineComponent({
    name: 'DeptDrawer',
    components: { BasicDrawer, BasicForm, PersonalSelector, Button, Tag },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const isUpdate = ref(true);
      const [registerPersonalDrawer, { openDrawer: openPersonalSelector, setDrawerProps: setPersonalDrawerProps }] = useDrawer();

      const selectedPersonList = ref([]);

      const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
        labelWidth: 120,
        schemas: deptFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        await resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        const treeData = await getCompanies();
        
        let formData = data.record;

        if(formData.id && formData.deptHeadId){
          selectedPersonList.value = [{id:formData.deptHeadId,userCode:formData.deptHeadCode, userName:formData.deptHeadName}];
        }else{
          selectedPersonList.value = [];
        }
        await updateSchema([
          {
            field: 'companyId',
            componentProps: { treeData },
            dynamicDisabled:unref(isUpdate) || data.record.parentId  ? true : false
          }
        ]);
        if(formData.companyId){
          setFieldsValue({
            companyId: formData.companyId,
            companyCode: formData.companyCode
          });
        }
        setFieldsValue({
          ...data.record,
          status: data.record.status === 1,
        });
      });

      const getTitle = computed(() =>
        !unref(isUpdate) ? t('common.addText') + ' ' + t('views.components.dept') : t('common.updateText') + ' ' + t('views.components.dept'),
      );

      // 弹出选择领导
      function handleSettingLeader() {
        openPersonalSelector(true, {
          selectorProps:{
            multiSelect: false,
            selectedList: selectedPersonList.value,
          }
        });

        setPersonalDrawerProps({
          title: t('views.dept.settingLeader'),
          width: '90%',
        });
      }

      // 设置领导成功回调
      async function handleSettingLeaderSuccess(selectedPersonals: any) {
        selectedPersonList.value = selectedPersonals.map(item=>{return {id: item.id, userCode: item.userCode, userName: item.userName}});
        if(selectedPersonals&& selectedPersonals.length>0){
          setFieldsValue({
            deptHeadId: selectedPersonals[0].id,
            deptHeadName: selectedPersonals[0].userName,
            deptHeadCode: selectedPersonals[0].userCode,
          });
        }else{
          setFieldsValue({
            deptHeadId: '',
            deptHeadName: '',
            deptHeadCode:''
          });
        }
      }
      async function handleDeleteLeader() {
        setFieldsValue({
          deptHeadId: '',
          deptHeadName: '',
          deptHeadCode:''
        });
        selectedPersonList.value = [];
      }

      async function handleSubmit() {
        try {
          setDrawerProps({confirmLoading: true});
          const values = await validate();
          values.parentId = values.parentId ? values.parentId : 0
          values.status = values.status ? 1 : 0;
          // 根据公司id获取公司编码
          const data:CompanyInfo = await getInfo(values.companyId);
          values.companyCode = data.companyCode
          const api = !unref(isUpdate) ? saveInfo : updateInfo
          await api(values);
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({confirmLoading: false});
        }
      }

      return {
        registerDrawer,
        registerForm,
        getTitle,
        registerPersonalDrawer,
        selectedPersonList,
        handleDeleteLeader,
        handleSettingLeader,
        handleSubmit,
        handleSettingLeaderSuccess,
        t
      };
    },
  });
</script>
