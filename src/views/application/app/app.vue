<template>
  <PageWrapper contentFullHeight fixedHeight contentClass="flex flex-col" v-loading="loading">
    <div class="p-4 bg-white">
      <BasicForm @register="registerForm">
        <template #appCode="{model,field}">
           <Authority :value="route.name+':'+PerEnum.ADD" >
              <Button type="primary" @click="handleCreate" class="mr-4" :icon="h(PlusOutlined)"> 
                {{getPermissionInfo(route.name + ':' + PerEnum.ADD)?.name}} 
              </Button>
          </Authority>
          <Button type="danger" :icon="h(DeleteOutlined)" @click="clear"> 
            清空缓存
          </Button>
        </template>
        <template #appName="{model,field}">
          <a-input-search
            v-model:value="model[field]"
            :placeholder="t('common.inputText')"
            enter-button
            @search="onSearch"
          />
          <!-- <Tooltip>
            <template #title>
              <div class="w-50">每行显示数量</div
              ><Slider id="slider" v-bind="sliderProp" v-model:value="grid" @change="sliderChange"
            /></template>
            <Button  style="display:inline-block"><TableOutlined /></Button>
          </Tooltip> -->
        </template>
      </BasicForm>
    </div>
    <div class="p-2 bg-white flex-1 flex flex-wrap" style="overflow-y:auto">
      <div v-for="(item,index) in data" :key="index" class="app-list">
        <ListItem>
          <div class="newApplication_item">
            <div class="iconBg" :style="{ background: item.appIconColor }">
              <Icon :icon="item.appIcon" class="iconLogo" :size="32" />
            </div>
            <p class="listName">{{ item.appName }}</p>
          </div>
          <div class="applicationDev_operation" v-if="getPermissionInfo(route.name + ':' + PerEnum.UPDATE)?.name || getPermissionInfo(route.name + ':' + PerEnum.DELETE)?.name">
            <Icon icon="ant-design:setting-outlined" @click="clickIndex = index"/>
            <ul class="el-dropdown-menu" :style="{display:clickIndex == index ? 'block' : 'none'}">
              <Authority :value="route.name+':'+PerEnum.UPDATE" >
                <li class="el-dropdown-menu__item" @click="handleEdit(item)">
                  <a-button size="small" type="link">{{ getPermissionInfo(route.name + ':' + PerEnum.UPDATE)?.name }}</a-button>

                </li>
              </Authority>
              <Authority :value="route.name+':'+PerEnum.DELETE" >
                <li class="el-dropdown-menu__item" @click="handleDelete(item)" v-if="item.appCode != appCode">
                  <a-button size="small" type="link" danger>{{ getPermissionInfo(route.name + ':' + PerEnum.DELETE)?.name }}</a-button>
                </li>
              </Authority>
            </ul>
          </div>
        </ListItem>
      </div>
    </div>
    <AppDrawer @register="registerDrawer" @success="fetch" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { computed, onMounted, ref,h } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { List, Card, Image, Typography, Tooltip, Slider, Avatar ,InputSearch} from 'ant-design-vue';
  import { Authority } from "/@/components/Authority";
  import { TableOutlined,PlusOutlined,DeleteOutlined } from "@ant-design/icons-vue"
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Dropdown } from '/@/components/Dropdown';
  import { BasicForm, useForm } from '/@/components/Form';
  import { propTypes } from '/@/utils/propTypes';
  import { Button } from '/@/components/Button';
  import { isFunction } from '/@/utils/is';
  import { getAppPage,deleteByIds, getInfo } from '/@/api/application/app/app';
  import { useSlider, grid, searchFormSchema } from './app.data';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useRoute } from 'vue-router'
  import { Icon } from "/@/components/Icon";
  import { usePermission } from '/@/hooks/web/usePermission';
  import { PerEnum } from "/@/enums/perEnum";
  import AppDrawer from './AppDrawer.vue'
  import { useDrawer } from '/@/components/Drawer';
  import { useGlobSetting } from '/@/hooks/setting';
  const globSetting = useGlobSetting();
  const appCode = globSetting.appCode
  const { createWarningModal, createMessage } = useMessage();
  const { getPermissionInfo } = usePermission();
  const route = useRoute()
  const { t } = useI18n();
  const ListItem = List.Item;
  const CardMeta = Card.Meta;
  const TypographyText = Typography.Text;
  // 获取slider属性
  const sliderProp = computed(() => useSlider(4));
  // 组件接收参数
  const props = defineProps({
    // 请求API的参数
    params: propTypes.object.def({}),
    //api
    api: propTypes.func,
  });
  //暴露内部方法
  const emit = defineEmits(['getMethod', 'delete']);
  //数据
  const data = ref([]);
  const clickIndex = ref()
  const loading = ref(false)
  // 切换每行个数
  // cover图片自适应高度
  //修改pageSize并重新请求数据

  const height = computed(() => {
    return `h-${120 - grid.value * 6}`;
  });
  const [registerDrawer, { openDrawer,setDrawerProps }] = useDrawer();
  //表单
  const [registerForm, { validate }] = useForm({
    schemas: searchFormSchema,
    labelWidth: 80,
    actionColOptions:{
      span:0
    },
    baseColProps: { span: 6 },
    autoSubmitOnEnter: true,
    showResetButton:false,
    showSubmitButton:false,
    submitFunc: handleSubmit,
  });
  //表单提交
  async function handleSubmit() {
    const data = await validate();
    await fetch(data);
  }
  function sliderChange(n) {
    pageSize.value = n * 4;
    fetch();
  }

  // 自动请求并暴露内部方法
  onMounted(() => {
    fetch();
    // emit('getMethod', fetch);
  });

  async function fetch(p = {}) {
    // const { api, params } = props;
    const api = getAppPage;
    const params = {};
    if (api && isFunction(api)) {
      loading.value = true
      try {
        const res = await api({ ...params, pageNum: pageNum.value, pageSize: pageSize.value, ...p });
        data.value = res;
        loading.value  = false
      } catch (error) {
        loading.value  = false
      }
      // total.value = res.total;
    }
  }
  //分页相关
  const pageNum = ref(1);
  const pageSize = ref(36);
  const total = ref(0);
  const paginationProp = ref({
    showSizeChanger: false,
    showQuickJumper: false,
    pageSize,
    current: pageNum,
    total,
    showTotal: (total) => `总 ${total} 条`,
    onChange: pageChange,
    onShowSizeChange: pageSizeChange,
  });

  function pageChange(p, pz) {
    pageNum.value = p;
    pageSize.value = pz;
    fetch();
  }
  function pageSizeChange(_current, size) {
    pageSize.value = size;
    fetch();
  }

  async function handleDelete(item) {
    createWarningModal({
      title: t('common.prompt'),
      content: t('common.okText')+getPermissionInfo(route.name + ':' + PerEnum.DELETE)?.name,
      closable: true,
      okCancel:true,
      onOk: () => {
        deleteByIds({ids:item.id}).then(()=>{
          createMessage.success(t('layout.setting.operatingTitle'))
          fetch()
        })
      }
    })
    // emit('delete', id);
  }

  function onSearch(value){
    console.log('value',value)
    fetch({
      appName:value
    })
  }

  function handleCreate(){
    openDrawer(true,{
      isUpdate:false
    })
    setDrawerProps({
      width:'calc((100% - 220px)*(2/3))'
    })
  }

  async function handleEdit(item){
    let record = await getInfo(item.id)
    openDrawer(true,{
      isUpdate:true,
      record
      // record:{"appConfigs":[{"confType":"1","confCode":"SITE_FAVICON","confName":"","sort":1,"status":1},{"confType":"1","confCode":"SITE_TITLE","confName":"","confValue":"系统标题","sort":1,"status":1},{"confType":"1","confCode":"SITE_DESCRIPTION","confName":"","confValue":"系统描述","sort":1,"status":1},{"confType":"4","confCode":"MAIL_PROTOCOL","confName":"","confValue":"smtp","sort":1,"status":1},{"confType":"4","confCode":"MAIL_HOST","confName":"","confValue":"服务器地址","sort":1,"status":1},{"confType":"4","confCode":"MAIL_PORT","confName":"","confValue":"服务器端口","sort":1,"status":1},{"confType":"4","confCode":"MAIL_USERNAME","confName":"","confValue":"发件人名称","sort":1,"status":1},{"confType":"4","confCode":"SENDER_EMAIL","confName":"","confValue":"发件人邮箱","sort":1,"status":1},{"confType":"4","confCode":"MAIL_PASSWORD","confName":"","confValue":"123456","sort":1,"status":1},{"confType":"4","confCode":"MAIL_CODE","confName":"","confValue":"GBK","sort":1,"status":1}],"id":"1821060135041970178","appCode":"2422066779","appKey":"q2xlibi9","appSecret":"309e7a4a4a12c9aa0318ad29453112e14031ed81","appName":"IAM","appNameEn":"IAM","appIcon":"ant-design:info-outlined","appIconColor":"#1890ff","appRemark":"","appRemarkEn":"","appIcp":"","requestLimit":"","status":1,"configList":"#1890ff"}
    })
    setDrawerProps({
      width:'calc((100% - 220px)*(2/3))'
    })
  }

  function clear(){
    clickIndex.value = ''
    fetch()
  }
</script>
<style lang="less" scoped>
  .app-list {
    /deep/ .ant-list-item {
      position: relative;
      margin: 5px 13px 15px 6px !important;
      width: 135px;
      height: 140px;
      border-radius: 8px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      &:hover {
        background-color: #f5f5f5;
        .applicationDev_operation {
          display: block;
        }
      }
      .newApplication_item {
        position: relative;
        padding: 20px 0 0 0;
        width: 135px;
        height: 140px;
        .iconBg {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          width: 77px;
          height: 77px;
          border-radius: 8px;
          .iconLogo {
            color: #fff;
            font-size: 28px;
          }
        }
        .listName {
          position: relative;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 15px;
          padding-right: 1em;
          padding-left: 1em;
          max-height: 2.3em;
          color: #333;
          text-align: center;
          word-break: break-all;
          font-size: 14px;
          line-height: 1.2em;
        }
      }
      .applicationDev_operation {
        position: absolute;
        top: 0;
        margin-top: 10px;
        padding: 0 10px;
        width: 100%;
        display: none;
        .el-dropdown-menu {
          display: none;
          cursor: pointer;
          width: 90px;
          text-align: center;
          background-color: #fefefe;
          z-index: 100;
          padding: 0;
          .el-dropdown-menu__item {
            margin: 0;
            font-size: 14px;
            color: #606266;
            cursor: pointer;
            outline: 0;
            }
        }
      }
    }
  }
</style>
