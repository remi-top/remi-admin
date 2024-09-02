<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" class="personalForm" >
      <template #userRoles="{ model, field }">
        <a-tag v-for="item in model['userRoles']" :key="item.id" :color="roleTypeMap[item.roleType]?.color" >{{item[RoleNameLocaleLang[getLocale]]}}</a-tag>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import {
    FormItem
 } from 'ant-design-vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, Rule, useForm } from '/@/components/Form/index';
  import { personalFormSchema } from './personal.data';
  import { saveInfo, updateInfo } from '/@/api/org/personal';
  import { getInfo } from '/@/api/org/positionInfo';
  import { getDeptsTreeLeft } from '/@/api/org/dept';
  import { getJobRankList } from '/@/api/org/jobRank';
  import { Upload } from 'ant-design-vue';
  import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isArray } from '/@/utils/is';
  import { PositionLabelLocaleLang } from '/@/enums/appEnum'
  import { useLocale } from '/@/locales/useLocale';
  import { RoleNameLocaleLang } from '/@/enums/appEnum'
  import { roleTypeMap } from '/@/views/permission/role/role.data'
  import { GetPreview } from '/@/api/sys/file'
  const { getLocale } = useLocale();
export default defineComponent({
  name: 'PersonalDrawer',
  components: { BasicDrawer, BasicForm, PlusOutlined, LoadingOutlined, Upload,FormItem },
  emits: ['success', 'register'],
  setup(_, { emit }) {
      const { t } = useI18n();
      const isUpdate = ref(true);
      const { createMessage } = useMessage();

      const [registerForm, { setFieldsValue, updateSchema,getFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 110,
        schemas: personalFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer, changeLoading }] = useDrawerInner(async (data) => {
        changeLoading(true);
        resetFields();
        setDrawerProps({ confirmLoading: false,minHeight:500 });
        isUpdate.value = !!data?.isUpdate;
        let values = data.record ? data.record : {}
        if(unref(isUpdate) && values.positionId){
          let positonInfo = await getInfo(values.positionId)
          let labelKey = PositionLabelLocaleLang[getLocale.value]
          values.positionName = positonInfo[labelKey]
        }
        let headPic = ''
        await updateSchema([
          {
            field: 'companyId',
            componentProps: {
              onChange: async (...arrg) => {
                console.log('...arrg...arrg',...arrg)
                let e = arrg[0]
                let companyInfo = arrg[2]
                let companyCode = companyInfo?.triggerNode?.props?.companyCode
                if(e){
                  await setFieldsValue({
                    deptId:'',
                    deptCode:'',
                    companyCode
                  })
                  const deptTreeData = await getDeptsTreeLeft({companyId: e});
                  await updateSchema([
                    {
                      field: 'deptId',
                      componentProps: { treeData: deptTreeData },
                    },
                  ]);
                } else {
                  await updateSchema([
                    {field: 'deptId', componentProps: {treeData: []}}
                  ]);
                  await setFieldsValue({
                    deptId:'',
                    deptCode:'',
                    companyCode:''
                  });
                }
              }
            }
          },
          {
            field: 'deptId',
            componentProps:{
              onChange: (...arrg)=>{
                let e = arrg[0]
                let deptInfo = arrg[2]
                let deptCode = deptInfo?.triggerNode?.props?.deptCode
                if(deptCode){
                  setFieldsValue({
                    deptCode
                  })
                }
              },
            }
          },
          {
            field:'positionId',
            componentProps:{
              onChange: async (...arrg)=>{
                console.log(arrg,'arrgarrgarrg')
                let e = arrg[0]
                let selectValue = arrg[3]?.[0]
                // console.log('arrgarrgarrg',selectValue,arrg)
                let options = await getJobRankList({status:1,positionId:e && e[0] })
                if(selectValue){
                  await setFieldsValue({
                    positionCode:selectValue?.positionCode,
                    rankId:'',
                    rankCode:''
                  })
                } else {
                  await updateSchema([
                    {
                      field:'positionId',
                      componentProps:{
                        options:[
                          {
                            label:values?.positionName,
                            value:values?.positionId,
                          }
                        ]
                      }
                    }
                  ])
                }
                await updateSchema([
                  {
                    field:'rankId',
                    componentProps:{
                      options
                    }
                  }
                ])
              },
            }
          },
          {
            field: 'loginName',
            dynamicDisabled:unref(isUpdate),
            colProps:{
              span:unref(isUpdate) ? 12 : 6
            }
          },
          {
            field: 'userRoles',
            show:unref(isUpdate),
          },
          {
            field: 'password',
            labelWidth:60,
            ifShow: !unref(isUpdate),
            colProps:{
              span:unref(isUpdate) ? 12 : 6
            }
          },
          {
            field: 'rankId',
            componentProps:{
              onChange: (...arrg)=>{
                let selectValue = arrg[1]
                console.log('rankIdrankIdrankId',selectValue,arrg)
                let rankCode = selectValue?.rankCode
                if(rankCode){
                  setFieldsValue({
                    rankCode
                  })
                }
              },
            }
          },
        ]);
        if(values.companyId){
          // 根据公司加载部门树
          const deptTreeData = await getDeptsTreeLeft({companyId: data.record.companyId});
          await updateSchema([
            {
              field: 'deptId',
              componentProps: { treeData: deptTreeData },
            },
          ]);
        }
        if(values.headPic){
          try {
            headPic = await GetPreview({
              fileName: values.headPic
            })
          } catch (error) {
            
          }
        }
        await setFieldsValue({
          ...data.record,
          // positionId:'',
          headPic:values.headPic ? [
            {
              id:values.headPic,
              name:values.headPic,
              url:headPic
            }
          ] : ''
        });
        changeLoading(false);
      });

      const getTitle = computed(() =>
        !unref(isUpdate) ? t('common.addText') + ' ' + t('views.components.user') : t('common.updateText') + ' ' + t('views.components.user'),
      );

      async function handleSubmit() {
        try {
          setDrawerProps({confirmLoading: true});
          const values = await validate();
          values.positionId = values.positionId[0]
          values.headPic = Array.isArray(values.headPic) ?  values.headPic.map(item=>item.name).join(',') : values.headPic
          console.log('values',values)
          // return
          if(unref(isUpdate)){
            delete values.password
          }
          const api = !unref(isUpdate) ? saveInfo : updateInfo
          await api(values);
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        roleTypeMap,
        RoleNameLocaleLang,
        getLocale:getLocale.value,
        t,
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
      };
    },
  });
</script>

<style lang="less" scoped>
  .personalForm{
    position: relative;
  }
</style>
