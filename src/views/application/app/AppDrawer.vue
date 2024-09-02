<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="getTitle" @ok="handleSubmit" >
    <BasicForm @register="registerForm" class="app-drawer">
       <template #appCode="{ model, field }">
        <a-tag color="green">{{model['appCode']}}</a-tag>
        <Icon class="copy_icon" icon="ant-design:copy-outlined" style="font-size: 18px" @click="onCopy(model['appCode'])"/>
      </template>
      <template #appKey="{ model, field }">
        <a-tag color="green">{{model['appKey']}}</a-tag>
        <Icon class="copy_icon" icon="ant-design:copy-outlined" style="font-size: 18px" @click="onCopy(model['appKey'])"/>
      </template>
      <template #appSecret="{ model, field }">
        <a-tag color="green">{{model['appSecret']}}</a-tag>
        <Icon class="copy_icon" icon="ant-design:copy-outlined" style="font-size: 18px" @click="onCopy(model['appSecret'])"/>
      </template>
      <template #setBgColor="{ model, field }">
        <ThemeColorPicker
          :colorList="colorList"
          :def="model['appIconColor']"
          @change="colorChange"
        />
      </template>
      <template #setConfig="{ model, field }">
        <div class="card-container">
          <a-tabs :activeKey="activeKey" type="card" @change="tabChange" class="h-full">
            <a-tab-pane :key="item.value" :tab="item.label" v-for="item in Object.values(confType)"></a-tab-pane>
          </a-tabs>
        </div>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, Rule, useForm } from '/@/components/Form/index';
  import { formSchema, colorList, confType, UploadImageKeys } from './app.data';
  import { saveInfo, updateInfo } from '/@/api/application/app/app';
  import { Upload } from 'ant-design-vue';
  import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
  
  import { ThemeColorPicker } from '/@/layouts/default/setting/components'
  import { useI18n } from '/@/hooks/web/useI18n';
  import { copyText } from '/@/utils'
  import { isArray } from 'lodash-es';
export default defineComponent({
  name: 'PersonalDrawer',
  components: { BasicDrawer, BasicForm, PlusOutlined, LoadingOutlined,ThemeColorPicker, Upload },
  emits: ['success', 'register'],
  setup(_, { emit }) {
      const { t } = useI18n();
      const isUpdate = ref(true);
      const activeKey = ref(2);
      const imageUrl = ref<string>('');
      let appConfigNameMap = ref( )
      const [registerForm, { setFieldsValue, resetFields,updateSchema,resetSchema, getFieldsValue, validate,appendSchemaByField }] = useForm({
        labelWidth: 105,
        schemas: formSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer, changeLoading }] = useDrawerInner(async (data) => {
        changeLoading(true);
        resetFields();
        resetSchema(formSchema)
        appConfigNameMap.value = {}
        activeKey.value = 2

        isUpdate.value = !!data?.isUpdate;
        // 自动生成配置项
        updateSchema([
          {
            field:'appCode',
            show:unref(isUpdate),
            dynamicDisabled:true
          },
          {
            field:'appKey',
            show:unref(isUpdate),
            dynamicDisabled:true
          },
          {
            field:'appSecret',
            show:unref(isUpdate),
            dynamicDisabled:true
          }
        ])
        Object.values(confType).forEach(async (item)=> {
          if(item.list && isArray(item.list)){
           item.list.map( async (i) => {
            appConfigNameMap.value[i.field] = {
              confName:i.label,
              confType:item.value,
              confCode:i.field,
            } 
            await appendSchemaByField(i,'')
           }) 
          }
        })
        if(unref(isUpdate)){
          let { appConfigs,...record } = data.record
          if(appConfigs && appConfigs.length){
            appConfigs.forEach(item => {
              let configs = {}
              configs[item.confCode] = item.confValue 
              setFieldsValue(configs)
            })
          }
          await setFieldsValue({
            ...record,
          });
        } else {
          await setFieldsValue({
            ...data.record,
          });
        }
        changeLoading(false);
        console.log('getFieldsValue',getFieldsValue())
      });

      const getTitle = computed(() =>
        !unref(isUpdate) ? t('common.addText')+t('views.components.application') : t('common.updateText')+t('views.components.application'),
      );
      async function handleSubmit() {
        try {
          setDrawerProps({confirmLoading: true});
          const values = await validate();
          const params = {
            appConfigs:[]
          }
          for (const key in values) {
            if (Object.prototype.hasOwnProperty.call(values, key)) {
              const element = values[key];
              if(appConfigNameMap.value[key]){
                console.log('key',key)
                let { confType, confCode, confName} = appConfigNameMap.value[key];
                let confValue = element
                params.appConfigs.push({
                  bindId:values.id,
                  bindCode:values.appCode,
                  confType,
                  confCode,
                  confName,
                  confValue,
                  sort: 1,
                  status: 1
                })
              } else {
                params[key] = element
              }
            }
          }
          // console.log('params',params);
          
          const api = !unref(isUpdate) ? saveInfo : updateInfo
          await api(params);
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }
      function colorChange(appIconColor){
        setFieldsValue({
          appIconColor
        })
        updateSchema({
          field:'appIcon',
          componentProps:{
            iconBgColor:appIconColor
          }
        })
      }

      function onCopy(text){
        copyText(text)
      }

      async function tabChange(key){
        let currentActiveKey = activeKey.value
        if(currentActiveKey === key){
          return
        }
        if(confType[key].list && confType[key].list.length > 0){
          await updateSchema(confType[key].list && confType[key].list.map(item => {
            return {
              field:item.field,
              show:true
            }
          }))
          
        }
        if(confType[unref(activeKey)].list && confType[unref(activeKey)].list.length > 0){
          await updateSchema(confType[unref(activeKey)].list && confType[unref(activeKey)].list.map(item => {
            return {
              field:item.field,
              show:false
            }
          }))
        }


        activeKey.value = key;

      }
      return {
        tabChange,
        confType,
        activeKey,
        onCopy,
        colorList,
        colorChange,
        registerDrawer,
        registerForm,
        getTitle,
        imageUrl,
        handleSubmit,
      };
    },
  });
</script>
<style scoped lang="less">
.app-drawer {
  /deep/ .vben-setting-theme-picker {
    margin: unset;
    justify-content: flex-start;
  }
}
</style>
<style scoped>
/* .card-container p {
  margin: 0;
}
.card-container > .ant-tabs-card .ant-tabs-content {
  height: 120px;
  margin-top: -16px;
}
.card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
  background: #fff;
}
.card-container > .ant-tabs-card > .ant-tabs-nav::before {
  display: none;
}
.card-container > .ant-tabs-card .ant-tabs-tab,
[data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab {
  background: transparent;
  border-color: transparent;
}
.card-container > .ant-tabs-card .ant-tabs-tab-active,
[data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab-active {
  background: #fff;
  border-color: #fff;
}
#components-tabs-demo-card-top .code-box-demo {
  padding: 24px;
  overflow: hidden;
  background: #f5f5f5;
}
[data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-content {
  height: 120px;
  margin-top: -8px;
}
[data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-tab {
  background: transparent;
  border-color: transparent;
}
[data-theme='dark'] #components-tabs-demo-card-top .code-box-demo {
  background: #000;
}
[data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
  background: #141414;
}
[data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-tab-active {
  background: #141414;
  border-color: #141414;
} */
</style>