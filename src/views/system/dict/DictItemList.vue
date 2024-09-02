<template>
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
      <template v-if="column.dataIndex=== 'status'">
        <Switch :checked="record['status']" :checkedChildren="t('common.enable')" :unCheckedChildren="t('common.disenabled')" :checkedValue='1' 
        :unCheckedValue='0' @click="(checked,e)=>changeStatus(record,column.dataIndex,e)"></Switch>
      </template>
    </template>
    <template #action="{ record }">
      <TableAction
        :actions="[
          {
            auth:route.name+':'+PerEnum.UPDATE,
            label: getPermissionInfo(route.name+':'+PerEnum.UPDATE)?.name,
            icon: getPermissionInfo(route.name+':'+PerEnum.UPDATE)?.menuIcon,
            onClick: handleEdit.bind(null, record),
          },
          // {
          //   auth:route.name+':'+PerEnum.DELETE,
          //   label: getPermissionInfo(route.name+':'+PerEnum.DELETE)?.name,
          //   icon: getPermissionInfo(route.name+':'+PerEnum.DELETE)?.menuIcon,
          //   color: 'error',
          //   onClick: handleDelete.bind(null, record),
          // },
        ]"
      />
    </template>
  </BasicTable>
  <DictItemDrawer @register="registerDrawer" @success="handleSuccess" />
</template>
<script lang="ts">
  import { defineComponent, ref,computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { Icon } from "/@/components/Icon";
  import { PerEnum } from "/@/enums/perEnum";
  import { Authority } from "/@/components/Authority";
  import { usePermission } from '/@/hooks/web/usePermission';
  import { Switch } from 'ant-design-vue'
  import { Button } from '/@/components/Button'
  import { useRoute } from 'vue-router'
  import { getDictItemPage, getInfo,deleteByIds,updateInfo } from '/@/api/system/dictItem/dictItem';
  import { columns, searchFormSchema } from './dictItem.data';
  import DictItemDrawer from './DictItemDrawer.vue';
  import { BasicDrawer,useDrawerInner } from '/@/components/Drawer';
  import { useDrawer} from '/@/components/Drawer';
  import { DictItemInfo } from '/@/api/system/dictItem/dictItemModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
export default defineComponent({
  name: 'dictItem',
  components: { BasicTable, BasicDrawer,TableAction, DictItemDrawer,Icon,Button,Switch,Authority },
  setup() {
    const { t } = useI18n();
      let disabled = ref(<boolean>true)
      let formData = ref(<DictItemInfo>{})
      const { createWarningModal, createMessage } = useMessage();
      const { getPermissionInfo } = usePermission();
      const route = useRoute()
      const [registerDrawer,{setDrawerProps,openDrawer}] = useDrawer()
      const [registerTable, { reload, setLoading,setProps ,clearSelectedRowKeys, getSelectRowKeys ,getSelectRows}] = useTable({
        api: getDictItemPage,
        immediate:false,
        columns,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          showAdvancedButton: false,
          showResetButton: true,
          autoSubmitOnEnter: true,
          actionColOptions: {
            span: 8,
            lg: { span: 8, offset: 0 },
            sm: { span: 12, offset: 0 },
            xs: { span: 12, offset: 0 },
          },
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
        actionColumn: {
          width:80,
          title: t('common.operating'),
          dataIndex: 'action',
          fixed: 'right',
          slots: { customRender: 'action' }
        },
      });

      function handleCreate() {
        console.log('formDataformData',formData)
        if(!unref(formData)?.id){
          createMessage.warning(t('common.chooseText') + ' ' + t('views.components.dict'))
          return  
        }
        openDrawer(true, {
          isUpdate: false,
          record:{
            dictId:unref(formData)?.id,
            dictCode:unref(formData)?.dictCode
          }
        });
        setDrawerProps({
          width:'calc((100% - 220px)*(1/3))'
        })
      }

      async function handleEdit(record: Recordable,e) {
        e && e.stopPropagation();
        setLoading(true);
        const data: DictItemInfo = await getInfo(record.id);
        setLoading(false);
        openDrawer(true, {
          record: data,
          isUpdate: true,
        });
        setDrawerProps({
          width:'calc((100% - 220px)*(1/3))'
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

      async function fetch(record){
        formData.value = record
        await setProps({
          searchInfo:{
            dictId:record.id,
          }
        })
        await reload()
      }

      const getTitle = computed(() =>
        t('views.components.dictItem')
      );

      return {
        fetch,
        registerDrawer,
        disabled,
        rowSelectionChange,
        getSelectRowKeys,
        route,
        getPermissionInfo,
        PerEnum,
        getTitle,
        registerTable,
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