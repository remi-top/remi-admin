<template>
  <PageWrapper fixedHeight contentClass="flex">
    <Group @click-row="handleSelect"/>
    <div class="splitpanes__splitter"></div>
    <BasicTable @register="registerTable" class="w-1/2" style="height:auto">
      <template #toolbar>
        <Authority :value="route.name+':'+PerEnum.ADD" >
          <Button type="primary" @click="handleCreate"> 
            <template #icon>
              <Icon v-if="getPermissionInfo(route.name+':'+PerEnum.ADD)?.menuIcon" 
              :icon="getPermissionInfo(route.name+':'+PerEnum.ADD)?.menuIcon"></Icon>
            </template>
            {{getPermissionInfo(route.name + ':' + PerEnum.ADD)?.name}} 
          </Button>
        </Authority>
        <Authority :value="route.name+':'+PerEnum.DELETE" >
          <Button type="primary" @click="handleDelete()" danger :disabled="disabled" color="error">
            <template #icon>
              <Icon v-if="getPermissionInfo(route.name+':'+PerEnum.DELETE)?.menuIcon" 
              :icon="getPermissionInfo(route.name+':'+PerEnum.DELETE)?.menuIcon"></Icon>
            </template>
            {{getPermissionInfo(route.name + ':' + PerEnum.DELETE)?.name}} 
          </Button>
        </Authority>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'status'">
          <Switch :checked="record['status']" :checkedChildren="t('common.enable')" :unCheckedChildren="t('common.disenabled')" :checkedValue='1' :unCheckedValue='0' @click="(checked,e)=>changeStatus(record,column.dataIndex,e)"></Switch>
        </template>
      </template>
    </BasicTable>
    <PersonalSelector @register="registerPersonalSelectorModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref,computed, h } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getUserGroupPage, getInfo,deleteByIds ,updateInfo, saveInfo} from '/@/api/org/userGroup';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import { Popconfirm, Tooltip } from "ant-design-vue";
  import { Button } from '/@/components/Button'
  import { PlusOutlined,SyncOutlined,DeleteOutlined,FormOutlined } from '@ant-design/icons-vue';
  import { Switch } from 'ant-design-vue';
  import { columns, searchFormSchema } from './userGroup.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {PerEnum} from '/@/enums/perEnum';
  import {Authority} from "/@/components/Authority";
  import { Icon } from "/@/components/Icon";
  import { usePermission } from '/@/hooks/web/usePermission';
  import PersonalSelector from '/@/views/components/selector/personalSelector/index.vue';
  import Group from './group/index.vue';
  import { useRoute } from 'vue-router'
  const { createMessage,createWarningModal } = useMessage();
  import { useI18n } from '/@/hooks/web/useI18n';
  export default defineComponent({
    name: 'UserGroup',
    components: {
      BasicTable,
      PageWrapper,
      TableAction, 
      Switch, 
      Popconfirm,
      Authority,
      Icon,
      Button,
      Group,
      PlusOutlined,
      SyncOutlined,
      DeleteOutlined,
      FormOutlined,
      Tooltip,
      PersonalSelector
    },
    setup() {
      const { t } = useI18n();
      let disabled = ref(<boolean>true)
      const { getPermissionInfo } = usePermission();
      const route = useRoute()
      const [registerPersonalSelectorModal, { openModal:openPersonalSelectorModal, setModalProps }] = useModal();
      const currentTreeNode = ref<Recordable>(null);

      const [registerTable, { reload, setProps,setLoading,getDataSource,setTableData:setPositionTableData ,clearSelectedRowKeys, getSelectRowKeys ,getSelectRows}] = useTable({
        api: getUserGroupPage,
        columns,
        immediate:false,
        formConfig: {
          // labelWidth: 100,
          schemas: searchFormSchema,
          showAdvancedButton: true,
          showResetButton: true,
          autoSubmitOnEnter: true,
        },
        rowSelection: {
          type: 'checkbox',
          columnWidth: 30,
          onChange:rowSelectionChange
        },
        showTableSetting: true,
        canColDrag: true,
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        // actionColumn: {
        //   // width: 100,
        //   title: t('common.operating'),
        //   dataIndex: 'action',
        //   fixed:'right'
        // },
      });

      function handleCreate() {
        if(!currentTreeNode.value){
          createMessage.warning(t('views.components.userGroupSelectText'))
          return
        }
        openPersonalSelectorModal(true, {
          isUpdate: false,
          record:{
            groupId:currentTreeNode.value?.id,
            groupCode:currentTreeNode.value?.groupCode,
          },
          selectedList:[]
        });
        setModalProps({
          width:'90%',
        })
      }

      function handleDelete(record?: Recordable,e) {
        e && e.stopPropagation();
        let DeleteItem = []
        if (record) {
          DeleteItem = [record]
        } else {
          DeleteItem = getSelectRows()
        }
        createWarningModal({
          title: t('common.prompt'),
          content: `${t('common.delItemMsg')}`,
          closable: true,
          okCancel:true,
          onOk: () => {
            setLoading(true)
            deleteByIds({ids:DeleteItem.map(i => i.id).join(',')}).then(() => {
              setLoading(false)
              clearSelectedRowKeys()
              rowSelectionChange(getSelectRowKeys())
              reload();
            }).catch(() => {
              setLoading(false)
            })
          }
        })
      }

      // function handleSuccess() {
      //   setTimeout(()=>{
      //     handleSelect(currentTreeNode.value);
      //   }, 200);
        
      // }
      async function handleSuccess(selectedPersonals: any) {
        console.log('selectedPersonals',selectedPersonals)
        try {
          if(selectedPersonals && selectedPersonals.length){
            setLoading(true)
            let arr = selectedPersonals.map(item => {
              return {
                groupId:currentTreeNode.value?.id,
                groupCode:currentTreeNode.value?.groupCode,
                userId:item.id,
                userCode:item.userCode,
                status:1,
                sort:0
              }
            })
            await saveInfo(arr)
            setLoading(false)
            reload()
          }
        } catch (error) {
          setLoading(false)
        }
      }
      function handleSelect(node:any) {
        console.log('node',node)
        currentTreeNode.value = node;
        let searchInfo = {groupId: node?node.id:''};
        setProps({searchInfo: searchInfo});
        if(!node){
          setPositionTableData([])
          return
        }
        reload({ searchInfo });
      }
      function changeStatus(record, field, e) {
        e.stopPropagation();
        // console.log('field', record, field);
        let params = {
          id:record.id
        }
        params[field] = record[field] ? 0 : 1
        let message = {
          0:'',
          1:''
        }
        switch (field) {
          case 'status':
            message[1] = t('common.disenabled');
            message[0] = t('common.enable');
            break;
          default:
            break;
        }
        const msg = message[record[field]];
        createWarningModal({
          title: t('common.prompt'),
          content: t('common.confirm', [msg]),
          closable: true,
          okCancel:true,
          onOk: () => {
            setLoading(true)
            updateInfo(params).then(() => {
              setLoading(false)
              reload()
            }).catch(() => {
              setLoading(false)
            })
          }
        })
      }

      function rowSelectionChange(value) {
        disabled.value = value?.length ? false : true
      }
      return {
        h,
        rowSelectionChange,
        disabled,
        getSelectRowKeys,
        route,
        getPermissionInfo,
        PerEnum,
        changeStatus,
        registerTable,
        registerPersonalSelectorModal,
        handleCreate,
        handleDelete,
        handleSuccess,
        handleSelect,
        t,
      };
    },
  });
</script>
<style scoped lang="scss">
</style>
