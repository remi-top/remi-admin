<template>
  <PageWrapper fixedHeight contentClass="flex">
    <AppIconTree class="mr-2 w-1/5"  @select="handleSelect" />
    <BasicTable @register="registerTable" class="w-4/5 flex-1" style="height:auto">
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
        <Button type="primary" @click="handleExpandAll"> 
          <template #icon>
            <Icon icon="ant-design:column-height-outlined"></Icon>
          </template>
          {{ (isExpandAll ? t('component.form.putAway') : t('component.form.unfold')) + t('views.menu.menuText')}} 
        </Button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex=== 'status'">
          <Switch :checked="record['status']" :checkedChildren="t('common.enable')" :unCheckedChildren="t('common.disenabled')" :checkedValue='1' 
          :unCheckedValue='0' @click="(checked,e)=>changeStatus(record,column.dataIndex,e)"></Switch>
        </template>
        <template v-if="column.dataIndex=== 'visible'">
          <template v-if="record.menuType != '3'">
            <Switch :checked="record['visible']" :checkedChildren="t('views.menu.show')" :unCheckedChildren="t('views.menu.hide')" :checkedValue='1' :unCheckedValue='0' @click="(checked,e)=>changeStatus(record,column.dataIndex,e)"></Switch>
          </template>
          <template v-else>-</template>
        </template>
        <template v-if="column.dataIndex=== 'keepAlive'">
          <template v-if="record.menuType != '3'">
            <Switch :checked="record['keepAlive']" :checkedChildren="t('views.menu.cache')" :unCheckedChildren="t('views.menu.uncached')" :checkedValue='1' :unCheckedValue='0' @click="(checked,e)=>changeStatus(record,column.dataIndex,e)"></Switch>
          </template>
          <template v-else>-</template>
        </template>
        <template v-if="column.dataIndex=== 'menuShortcut'">
          <template v-if="record.menuType != '3'">
            <Switch :checked="record['menuShortcut']" :checkedChildren="t('views.menu.yes')" :unCheckedChildren="t('views.menu.no')" :checkedValue='1' :unCheckedValue='0' @click="(checked,e)=>changeStatus(record,column.dataIndex,e)"></Switch>
          </template>
          <template v-else>-</template>
        </template>
        <template v-if="column.dataIndex=== 'action'">
          <TableAction
            :actions="[
              {
                auth:route.name+':'+PerEnum.ADDC,
                ifShow:record.menuType != '3',
                label: `${getPermissionInfo(route.name + ':' + PerEnum.ADDC)?.name}`,
                // icon: `${getPermissionInfo(route.name+':'+PerEnum.ADDC)?.menuIcon}`,
                onClick: handleCreateChild.bind(null, record),
              },
              {
                auth:route.name+':'+PerEnum.UPDATE,
                label: `${getPermissionInfo(route.name + ':' + PerEnum.UPDATE)?.name}`,
                // icon: `${getPermissionInfo(route.name+':'+PerEnum.UPDATE)?.menuIcon}`,
                onClick: handleEdit.bind(null, record),
              },
              // {
              //   auth:route.name+':'+PerEnum.DELETE,
              //   label: `${getPermissionInfo(route.name + ':' + PerEnum.DELETE)?.name}`,
              //   // icon: `${getPermissionInfo(route.name+':'+PerEnum.DELETE)?.menuIcon}`,
              //   color: 'error',
              //   onClick: (e)=>{e.stopPropagation();},
              //   onClick: handleDelete.bind(null, record),
              // },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <ModuleDrawer @register="registerDrawer" @success="handleSuccess" />
    <!-- <PValueSettingDrawer @register="registerPValueDrawer" @success="handleSuccess" /> -->
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref, nextTick,computed } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getModules, deleteByIds,getInfo,updateInfo } from '/@/api/permission/module';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PageWrapper } from '/@/components/Page';
  import { columns, searchFormSchema } from './module.data';
  import AppIconTree from '/@/views/components/leftTree/AppIconTree.vue'
  
  import ModuleDrawer from './ModuleDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { Icon } from "/@/components/Icon";
  import { PerEnum } from "/@/enums/perEnum";
  import { Authority } from "/@/components/Authority";
  import { usePermission } from '/@/hooks/web/usePermission';
  import { Button } from '/@/components/Button'
  import { useRoute } from 'vue-router'
  const { createWarningModal,createMessage} = useMessage();
  import { Switch } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { MenuLocaleLang  } from '/@/enums/appEnum'
  import { useLocale } from '/@/locales/useLocale';
  const { getLocale } = useLocale();
  export default defineComponent({
    name: 'Module',
    components: {
      BasicTable,
      TableAction,
      ModuleDrawer,
      Switch,
      PageWrapper,
      AppIconTree,
      Button,
      Authority,
      Icon,
    },
    setup() {
      const { t } = useI18n();
      const isExpandAll = ref(false)
      let disabled = ref(<boolean>true)
      const { getPermissionInfo } = usePermission();
      const route = useRoute()
      const currentNode = ref<Recordable>({});
      const [registerDrawer, { openDrawer, setDrawerProps }] = useDrawer();
      const [registerTable, { reload,setProps, expandAll,collapseAll,setLoading,clearSelectedRowKeys, getSelectRowKeys, getSelectRows }] = useTable({
        api: getModules,
        columns,
        immediate:false,
        isTreeTable:true,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          showAdvancedButton: true,
          showResetButton: true,
          autoSubmitOnEnter: true,
        },
        expandRowByClick: true,
        rowSelection: {
          type: 'checkbox',
          columnWidth: 30,
          onChange:rowSelectionChange
        },
        rowKey:'id',
        showTableSetting: true,
        canColDrag: true,
        useSearchForm: true,
        pagination: false,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 170,
          title: t('common.operating'),
          dataIndex: 'action',
          fixed:'right'
        },
      });

      function handleExpandAll(){
        if(isExpandAll.value){
          collapseAll()
        } else {
          expandAll()
        }
        isExpandAll.value = !unref(isExpandAll)
      }
      function handleCreate(record: Recordable) {
        setDrawerProps({ title: t('views.menu.addMenu'),width:'calc((100% - 220px)*(1/3))' });
        let params = {
          ...record
        }
        if (unref(currentNode)?.id) {
          params.appId = currentNode.value.id
          params.appCode = currentNode.value.appCode
        }
        openDrawer(true, {
          record:params,
          isUpdate: false,
        });
      }
      function handleCreateChild(record: Recordable, e) {
        e.stopPropagation();
        const key = MenuLocaleLang[getLocale.value]
        setDrawerProps({title: t('views.menu.addCMenu',[record[key]]),width:'calc((100% - 220px)*(1/3))' });
        record = {parentId: record.id,parentCode:record.menuCode,appCode:record.appCode, appId:record.appId};
        openDrawer(true, {
          record,
          isUpdate: false,
        });
      }

      async function handleEdit(record: Recordable, e) {
        e.stopPropagation();
        try {
          
          setLoading(true);
          const data = await getInfo(record.id)
          setLoading(false);
          setDrawerProps({title: t('views.menu.updateMenu'),width:'calc((100% - 220px)*(1/3))' });
          openDrawer(true, {
            record:data,
            isUpdate: true,
          });
        } catch (error) {
          setLoading(false);
          
        }
      }

      function handleDelete(record?: Recordable,e) {
        e && e.stopPropagation();
        let DeleteItem = []
        if (record) {
          DeleteItem = [record]
        } else {
          DeleteItem = getSelectRows()
        }
        let flag = DeleteItem.find(item => item.children && item.children.length > 0)
        if (flag) {
          createWarningModal({
            title: t('common.prompt'),
            content: t('views.menu.delItemMsg'),
          })
          return;
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

      async function handleSuccess(values) {
        // updateTableDataRecord(values.id,values)
        setTimeout(()=>{
          reload();
        }, 200);
        // setTimeout(()=>{
        //   expandAll();
        // }, 100)
      }

      function handleSelect(node: any) {
        console.log('nodevnode',node);
        currentNode.value = node;
        setProps({ searchInfo: { appId: node?node.id:'' } })
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
          case 'visible':
            message[1] = t('views.menu.hide')
            message[0] = t('views.menu.show')
            break;
          case 'keepAlive':
            message[1] = t('views.menu.uncached')
            message[0] = t('views.menu.cache')
            break;
          // case 'menuShortcut':
          //   message[1] = '不创建快捷方式'
          //   message[0] = '创建快捷方式'
          //   break;
          default:
            break;
        }
        // if (record[field]) {
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
        // } else {
        //   setLoading(true)
        //   updateInfo(params).then(() => {
        //     setLoading(false)
        //     reload()
        //   }).catch(() => {
        //     setLoading(false)
        //   })
        // }
      }

      function rowSelectionChange(value) {
        disabled.value = value?.length ? false : true
      }

      return {
        isExpandAll,
        disabled,
        rowSelectionChange,
        getSelectRowKeys,
        route,
        getPermissionInfo,
        PerEnum,
        registerTable,
        registerDrawer,
        handleExpandAll,
        handleSelect,
        handleCreate,
        handleEdit,
        handleCreateChild,
        handleDelete,
        handleSuccess,
        changeStatus,
        t
      };
    },
  });
</script>
