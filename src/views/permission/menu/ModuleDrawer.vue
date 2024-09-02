<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" style="margin:auto"/>
  </BasicDrawer>
</template>
<script lang="ts">
  import {defineComponent, ref, computed, unref} from 'vue';
  import {BasicDrawer, useDrawerInner} from '/@/components/Drawer';
  import {BasicForm, Rule, useForm} from '/@/components/Form/index';
  import {formSchema} from './module.data';
  import { saveInfo, updateInfo, getAppIconList, getModules } from '/@/api/permission/module';
  import { useI18n } from '/@/hooks/web/useI18n';
export default defineComponent({
  name: 'ModuleDrawer',
  components: {BasicDrawer, BasicForm},
  emits: ['success', 'register'],
  setup(_, {emit}) {
      const { t } = useI18n();
      const isUpdate = ref(true);

      const [registerForm, {resetFields, setFieldsValue,getFieldsValue,clearValidate, updateSchema, validate}] = useForm({
        labelWidth: 120,
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, {setDrawerProps, closeDrawer}] = useDrawerInner(async (data) => {
        await resetFields();
        setDrawerProps({confirmLoading: false});
        isUpdate.value = !!data?.isUpdate;
        let formData = data.record;
        // const treeData = await getAppIconList({ status: 1 });
        // console.log('treeDatatreeData',treeData);
        
        await updateSchema([
          {
            field: 'appId',
            componentProps: {
              onChange: (...arg) => {
                // 应用code改变需要重新请求改应用菜单数据
                console.log('arg',arg,arg[0]);
                clearValidate('appCode')
                setFieldsValue({
                  appCode: arg && arg.length && arg[2] ? arg[2]?.triggerNode.props?.appCode
                  : null
                })
                updateAppCodeList(arg && arg.length && arg[0] ? {appId:arg[0]} : {appId:null})
              }
            }
          },
          {
            field: 'menuCode',
            dynamicDisabled:unref(isUpdate)
          },
          {
            field: 'menuType',
            componentProps: {
              onChange: (e) => {
                // 按钮显示权限标识 不显示路由和路径
                if(e == 3){
                  let values = getFieldsValue()
                  setFieldsValue({
                    menuCode:values?.parentCode ? values.parentCode+':' : ''
                  })
                }
                updateSchemaByMenuType({
                  menuType:e
                })
              }
            }
          },
          {
            field: 'parentId',
            componentProps: {
              onChange: (...arg) => {
                let values = getFieldsValue()
                if(values.menuType == 3){
                  let menuCode = arg[2].triggerNode?.props?.menuCode
                  setFieldsValue({
                    parentCode:menuCode
                  })
                  setFieldsValue({
                    menuCode:menuCode+':'
                  })
                }
              }
            }
          },

        ]);
        setFieldsValue({
          ...formData,
          parentId:formData.parentId !== '0' ? formData.parentId  : null,
        })
        console.log('formData',formData);
        // 新增编辑弹框打开就请求
        updateAppCodeList({ appId: formData.appId })
        // 新增和编辑根据menuType初始化formSchema
        updateSchemaByMenuType(formData)
      });

      const getTitle = computed(() =>
        !unref(isUpdate) ? t('common.addText') : t('common.updateText'),
      );
      async function updateAppCodeList(params) {
        console.log('params', params);
        let treeData = []
        if (!params.appId) {
          treeData = []
          setFieldsValue({parentId:null})
        } else {
          treeData = await getModules(params)
        }
        updateSchema([
          {
            field: 'parentId',
            dynamicDisabled: false,
            componentProps: {
              treeData
            }
          }
        ])
      }
      function updateSchemaByMenuType(record){
        let {menuType} = record
        if (menuType == 3) {
          updateSchema([
            {
              field: 'menuPath',
              required: false,
              show:false
            },
            {
              field: 'menuComponent',
              required: false,
              show:false
            },
            {
              field: 'controllerPath',
              required: true,
              show:true
            },
            {
              field: 'visible',
              required: false,
              show:false
            },
            {
              field: 'keepAlive',
              required: false,
              show:false
            },
            {
              field: 'menuShortcut',
              required: false,
              show:false
            }
          ])
        } else {
          updateSchema([
            {
              field: 'menuPath',
              required: true,
              show:true
            },
            {
              field: 'menuComponent',
              required: true,
              show:true
            },
            {
              field: 'controllerPath',
              required: false,
              show:false
            },
            {
              field: 'visible',
              required: false,
              show:true
            },
            {
              field: 'keepAlive',
              required: false,
              show:true
            },
            {
              field: 'menuShortcut',
              required: false,
              show:true
            }
          ])
        }
      }
      async function handleSubmit() {
        try {
          setDrawerProps({confirmLoading: true});
          const values = await validate();
          values.parentId = values.parentId ? values.parentId : 0
          const api = !unref(isUpdate) ? saveInfo : updateInfo
          await api(values);
          closeDrawer();
          emit('success',values);
        } finally {
          setDrawerProps({confirmLoading: false});
        }
      }

      return {registerDrawer, registerForm, getTitle, handleSubmit,t};
    },
  });
</script>
