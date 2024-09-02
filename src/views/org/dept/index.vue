<template>
  <PageWrapper fixedHeight contentClass="flex">
    <CompanyTree @select="handleSelect" class="mr-2 w-1/5"/>
    <BasicTable @register="registerTable" class="w-4/5" style="height:auto">
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
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              // {
              //   auth:route.name+':'+PerEnum.AUTH,
              //   label: `${getPermissionInfo(route.name + ':' + PerEnum.AUTH)?.name}`,
              //   // icon: `${getPermissionInfo(route.name+':'+PerEnum.AUTH)?.menuIcon}`,
              //   onClick: handleAuthRole.bind(null, record),
              // },
              {
                auth:route.name+':'+PerEnum.ADDC,
                label: `${getPermissionInfo(route.name + ':' + PerEnum.ADDC)?.name}`,
                icon: `${getPermissionInfo(route.name+':'+PerEnum.ADDC)?.menuIcon}`,
                onClick: handleCreateChild.bind(null, record),
              },
              {
                auth:route.name+':'+PerEnum.UPDATE,
                label: `${getPermissionInfo(route.name + ':' + PerEnum.UPDATE)?.name}`,
                icon: `${getPermissionInfo(route.name+':'+PerEnum.UPDATE)?.menuIcon}`,
                onClick: handleEdit.bind(null, record),
              },
              // {
              //   auth:route.name+':'+PerEnum.DELETE,
              //   label: `${getPermissionInfo(route.name + ':' + PerEnum.DELETE)?.name}`,
              //   icon: `${getPermissionInfo(route.name+':'+PerEnum.DELETE)?.menuIcon}`,
              //   color: 'error',
              //   onClick: handleDelete.bind(null, record),
              // },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <DeptDrawer @register="registerDrawer" @success="handleSuccess" />
    </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref,computed } from 'vue';
  import { Switch } from 'ant-design-vue';
  import { Button } from '/@/components/Button'
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getDeptsTree,getDeptPage, deleteByIds,updateInfo, getInfo } from '/@/api/org/dept';
  import { PageWrapper } from '/@/components/Page';
  
  import CompanyTree from '/@/views/components/leftTree/CompanyTree.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDrawer } from '/@/components/Drawer';
  import DeptDrawer from './DeptDrawer.vue';
  import {DeptInfo} from "/@/api/org/model/deptModel";
  import { columns, searchFormSchema } from './dept.data';
  import {PerEnum} from '/@/enums/perEnum';
  import {Authority} from "/@/components/Authority";
  import { Icon } from "/@/components/Icon";
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useRoute } from 'vue-router'
  import { useI18n } from '/@/hooks/web/useI18n';
  import { DeptLabelLocaleLang  } from '/@/enums/appEnum'
  import { useLocale } from '/@/locales/useLocale';
  const { getLocale } = useLocale();
  export default defineComponent({
    name: 'DeptManagement',
    components: {
      BasicTable,
      PageWrapper,
      
      CompanyTree,
      Switch,
      DeptDrawer,
      TableAction,
      Icon,
      Button,
      Authority
    },
    setup() {
      const { t } = useI18n();
      let disabled = ref(<boolean>true)
      const { getPermissionInfo } = usePermission();
      const route = useRoute()
      const { createMessage,createWarningModal } = useMessage();
      const [registerDrawer, { openDrawer, setDrawerProps }] = useDrawer();
      const currentNode = ref<Recordable>({});
      const [registerTable, { reload,setProps,setLoading,clearSelectedRowKeys, getSelectRowKeys ,getSelectRows }] = useTable({
        api: getDeptsTree,
        immediate:false,
        columns,
        formConfig: {
          labelWidth: 80,
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
        expandRowByClick: true,
        useSearchForm: true,
        showIndexColumn: false,
        bordered: true,
        actionColumn: {
          width: 140,
          title: t('common.operating'),
          dataIndex: 'action',
          fixed:'right'
        },
      });

      function handleCreate() {
        setDrawerProps({title: t('common.addText'),width:'calc((100% - 220px)*(1/3))'});
        openDrawer(true, {
          record:{companyId: unref(currentNode)?.id,status:1},
          isUpdate: false,
        });
      }

      async function handleEdit(record: Recordable, e) {
        e.stopPropagation();
        try {
          
          setLoading(true)
          const data: DeptInfo = await getInfo(record.id)
          setLoading(false)
  
          setDrawerProps({ title: t('common.updateText') ,width:'calc((100% - 220px)*(1/3))'});
          openDrawer(true, {
            record:data,
            isUpdate: true,
          });
        } catch (error) {
          setLoading(false)
          
        }
      }

      function handleCreateChild(record: Recordable, e) {
        e.stopPropagation();
        const key = DeptLabelLocaleLang[getLocale.value]
        setDrawerProps({ title: t('views.dept.addItemModalTitle',[record[key]]),width:'calc((100% - 220px)*(1/3))'});
        const data = {parentId: record.id,companyId:record.companyId,companyName:record.companyName,status:1};
        openDrawer(true, {
          record: data,
          isUpdate: false,
        });
      }

      function handleDelete(record?: Recordable,e) {
        e && e.stopPropagation();
        let DeleteItem = []
        if (record) {
          DeleteItem = [record]
        } else {
          DeleteItem = getSelectRows()
        }
        // let flag = DeleteItem.find(item => item.children && item.children.length > 0)
        // if (flag) {
        //   createWarningDrawer({
        //     title: t('common.prompt'),
        //     content: t('views.dept.delDeptMsg'),
        //   })
        //   return;
        // }
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


      function doSearch() {
        reload();
      }

      function handleSuccess() {
        setTimeout(()=>{
          reload();
        }, 200);
      }

      function handleSelect(node: any) {
        currentNode.value = node;
        console.log(node.id, 'nodenodenode');
        if (node?.id) {
          setProps({ searchInfo:{ companyId: node.id } })
        } else {
          setProps({ searchInfo: { companyId: ''} })
        }
        reload();
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
        rowSelectionChange,
        disabled,
        getSelectRowKeys,
        route,
        getPermissionInfo,
        PerEnum,
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleCreateChild,
        handleDelete,
        handleSuccess,
        handleSelect,
        doSearch,
        changeStatus,
        t
      };
    },
  });
</script>
