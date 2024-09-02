<template>
  <PageWrapper fixedHeight contentClass="bg-white">
    <!-- <a-tabs defaultActiveKey="1" @change="tabChange"  style="padding:15px 20px 0 20px" type="card">
      <a-tab-pane tab="登录日志" key="1"></a-tab-pane>
      <a-tab-pane tab="操作日志" key="2"></a-tab-pane>
      <a-tab-pane tab="异常日志" key="4"></a-tab-pane>
    </a-tabs> -->
    <BasicTable @register="registerTable" class="flex-1" style="height:auto">
      <template #tableTitle>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'content'">
          <div @click="handleEdit(record)" class="content-btn">{{ record.content }}</div>
        </template>
      </template>
    </BasicTable>
    <!-- <LogRecordDrawer @register="registerDrawer" @success="handleSuccess" /> -->
    <LogRecordDrawer ref="OperationLogDetailDrawerRef" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref,computed } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { Icon } from "/@/components/Icon";
  import { PerEnum } from "/@/enums/perEnum";
  import { Authority } from "/@/components/Authority";
  import { usePermission } from '/@/hooks/web/usePermission';
  import { Switch } from 'ant-design-vue'
  
  import { Button } from '/@/components/Button'
  import { useRoute } from 'vue-router'
  import { getLogRecordPage, getPageLogin, getPageException } from '/@/api/system/logRecord/logRecord';
  import { PageWrapper } from '/@/components/Page';
  import { columns, searchFormSchema } from './logRecord.data';
  import LogRecordDrawer from '../module/LogRecordDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { LogRecordInfo } from '/@/api/system/logRecord/logRecordModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
export default defineComponent({
  name: 'logRecord',
  components: { BasicTable, TableAction, LogRecordDrawer,Icon,Button,Switch,Authority,PageWrapper },
  setup() {
      const { t } = useI18n();
      const OperationLogDetailDrawerRef = ref(null)
      let disabled = ref(<boolean>true)
      const { createWarningModal } = useMessage();
      const { getPermissionInfo } = usePermission();
      const route = useRoute()
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload, setLoading, setProps, setColumns,clearSelectedRowKeys, getSelectRowKeys ,getSelectRows}] = useTable({
        api: getLogRecordPage,
        columns:columns,
        formConfig: {
          // labelWidth: 120,
          schemas: searchFormSchema,
          showAdvancedButton: false,
          showResetButton: true,
          autoSubmitOnEnter: true,
        },
        // rowSelection: {
        //   type: 'checkbox',
        //   columnWidth: 30,
        //   onChange:rowSelectionChange
        // },
        showTableSetting: false,
        canColDrag: true,
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        clickToRowSelect:false,
        // actionColumn: {
        //   title: t('common.operating'),
        //   dataIndex: 'action',
        //   fixed: 'right',
        //   slots: { customRender: 'action' }
        // },
      });

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      async function handleEdit(record: Recordable,e) {
        e && e.stopPropagation();
        console.log('OperationLogDetailDrawerRef.value',OperationLogDetailDrawerRef.value)
        OperationLogDetailDrawerRef.value?.onDetail(record.id)
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
          content: t('common.delItemMsg'),
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
      function handleSuccess() {
        setTimeout(() => {
          reload();
        }, 200);
      }
      function changeStatus(record, field, e) {
        e.stopPropagation();
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

      // 日志类型
      function tabChange(key) {
        // searchInfo.logType = key;
        // //update-begin---author:wangshuai ---date:20220506  for：[VUEN-943]vue3日志管理列表翻译不对------------
        if (key == '2') {
          setColumns(columns)
          setProps({
            api: getLogRecordPage,
            formConfig:{
              schemas:searchFormSchema
            }
          })
        }else if(key == '4'){
          setColumns(errorColumns)
          setProps({
            api: getPageException,
            formConfig:{
              schemas:searchFormSchema
            }
          })
        } else {
          setColumns(loginColumns)
          setProps({
            api: getPageLogin,
            formConfig:{
              schemas:searchFormSchemaLogin
            }
          })
        }
        //update-end---author:wangshuai ---date:20220506  for：[VUEN-943]vue3日志管理列表翻译不对--------------
        reload();
      }

      return {
        OperationLogDetailDrawerRef,
        tabChange,
        disabled,
        rowSelectionChange,
        getSelectRowKeys,
        route,
        getPermissionInfo,
        PerEnum,
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        changeStatus,
        t
      };
    },
  });
</script>
<style lang="less" scoped>
.content-btn {
  color: @primary-color;
  cursor: pointer;
  text-decoration: underline;
}
</style>
