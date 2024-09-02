<template>
   <PageWrapper fixedHeight contentClass="flex">
    <BasicTable @register="registerTable" class="flex-1" style="height:auto">
      <template #toolbar>
        <Authority :value="route.name+':'+PerEnum.ADD" >
          <Button type="primary" @click="handleCreate"> 
            <template #icon>
              <Icon v-if="getPermissionInfo(route.name+':'+PerEnum.ADD)?.menuIcon" 
              :icon="getPermissionInfo(route.name+':'+PerEnum.ADD)?.menuIcon"></Icon>
            </template>
            {{getPermissionInfo(route.name+':'+PerEnum.ADD)?.name}} 
          </Button>
        </Authority>
        <Authority :value="route.name+':'+PerEnum.DELETE" >
          <Button type="primary" @click="handleDelete()" danger :disabled="disabled"  color="error"> 
            <template #icon>
              <Icon v-if="getPermissionInfo(route.name+':'+PerEnum.DELETE)?.menuIcon" 
              :icon="getPermissionInfo(route.name+':'+PerEnum.DELETE)?.menuIcon"></Icon>
            </template>
            {{getPermissionInfo(route.name+':'+PerEnum.DELETE)?.name}} 
          </Button>
        </Authority>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'status'">
          <Switch :checked="record['status']" :checkedChildren="t('common.enable')" :unCheckedChildren="t('common.disenabled')" :checkedValue='1' 
          :unCheckedValue='0' @click="(checked,e)=>changeStatus(record,column.dataIndex,e)"></Switch>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                auth:route.name+':'+PerEnum.ADDC,
                label: `${getPermissionInfo(route.name+':'+PerEnum.ADDC)?.name}`,
                icon: `${getPermissionInfo(route.name+':'+PerEnum.ADDC)?.menuIcon}`,
                onClick: handleCreateChild.bind(null, record),
              },
              {
                auth:route.name+':'+PerEnum.UPDATE,
                label: `${getPermissionInfo(route.name+':'+PerEnum.UPDATE)?.name}`,
                icon: `${getPermissionInfo(route.name+':'+PerEnum.UPDATE)?.menuIcon}`,
                onClick: handleEdit.bind(null, record),
              },
              // {
              //   auth:route.name+':'+PerEnum.DELETE,
              //   label: `${getPermissionInfo(route.name+':'+PerEnum.DELETE)?.name}`,
              //   icon: `${getPermissionInfo(route.name+':'+PerEnum.DELETE)?.menuIcon}`,
              //   color: 'error',
              //   onClick: handleDelete.bind(null, record),
              // },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <CompanyDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent,computed ,ref} from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { companyTree,getInfo,updateInfo } from '/@/api/org/company';
  import { Switch } from 'ant-design-vue';
  import { Button } from '/@/components/Button'
  import { columns, searchFormSchema } from './company.data';
  import CompanyDrawer from './CompanyDrawer.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDrawer } from '/@/components/Drawer';
  import { deleteByIds } from '/@/api/org/company';
  import { CompanyInfo } from "/@/api/org/model/companyModel";
  import {PerEnum} from '/@/enums/perEnum';
  import {Authority} from "/@/components/Authority";
  import { Icon } from "/@/components/Icon";
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useRoute } from 'vue-router'
  const { createMessage } = useMessage();
  import { useI18n } from '/@/hooks/web/useI18n';
  import { CompanyLabelLocaleLang  } from '/@/enums/appEnum'
  import { useLocale } from '/@/locales/useLocale';
  const { getLocale } = useLocale();
  export default defineComponent({
    name: 'Company',
    components: { BasicTable, TableAction,PageWrapper, CompanyDrawer,Switch,Button,Authority,Icon },
    setup() {
      const { t } = useI18n();
      let disabled = ref(<boolean>true)
      const { getPermissionInfo } = usePermission();
      const route = useRoute()
      const { createWarningModal } = useMessage();
      const [registerDrawer, { openDrawer, setDrawerProps }] = useDrawer();
      const [registerTable, { reload, setLoading,clearSelectedRowKeys, getSelectRowKeys ,getSelectRows}] = useTable({
        api: companyTree,
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
        canColDrag: true,
        pagination:false,
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
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
          isUpdate: false,
        });
      }

      async function handleEdit(record: Recordable, e) {
        e.stopPropagation();
        try {
          setLoading(true)
          const data: CompanyInfo = await getInfo(record.id)
          setLoading(false)
          setDrawerProps({title: t('common.updateText'),width:'calc((100% - 220px)*(1/3))'});
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
        const key = CompanyLabelLocaleLang[getLocale.value]
        setDrawerProps({title: t('views.company.addItemModalTitle',[record[key]]),width:'calc((100% - 220px)*(1/3))'});
        record = {
          parentId: record.id,
          status: 1
        };
        openDrawer(true, {
          record,
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
        //     content: `${t('views.company.delCompanyMsg')}`,
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
      function changeStatus(record, field,e) {
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
        doSearch,
        changeStatus,
        t
      };
    },
  });
</script>
