<template>
  <BasicTable @register="registerTable" class="w-1/2 table-custom-click-active-conent" style="height:auto">
    <template #toolbar>
      <Authority :value="route.name + ':' + PerEnum.ADD_GROUP">
        <Button type="primary" @click="handleCreate">
          <template #icon>
            <Icon
              v-if="getPermissionInfo(route.name + ':' + PerEnum.ADD_GROUP)?.menuIcon"
              :icon="getPermissionInfo(route.name + ':' + PerEnum.ADD_GROUP)?.menuIcon"
            ></Icon>
          </template>
          {{ getPermissionInfo(route.name + ':' + PerEnum.ADD_GROUP)?.name }}
        </Button>
      </Authority>
      <Authority :value="route.name + ':' + PerEnum.UPDATE_GROUP">
        <Button @click="handleEdit()" :disabled="!isEdit" color="warning">
          <template #icon>
            <Icon
              v-if="getPermissionInfo(route.name + ':' + PerEnum.UPDATE_GROUP)?.menuIcon"
              :icon="getPermissionInfo(route.name + ':' + PerEnum.UPDATE_GROUP)?.menuIcon"
            ></Icon>
          </template>
          {{ getPermissionInfo(route.name + ':' + PerEnum.UPDATE_GROUP)?.name }}
        </Button>
      </Authority>
      <Authority :value="route.name + ':' + PerEnum.DELETE_GROUP">
        <Button type="primary" @click="handleDelete()" danger :disabled="disabled" color="error">
          <template #icon>
            <Icon
              v-if="getPermissionInfo(route.name + ':' + PerEnum.DELETE_GROUP)?.menuIcon"
              :icon="getPermissionInfo(route.name + ':' + PerEnum.DELETE_GROUP)?.menuIcon"
            ></Icon>
          </template>
          {{ getPermissionInfo(route.name + ':' + PerEnum.DELETE_GROUP)?.name }}
        </Button>
      </Authority>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'status'">
        <Switch
          :checked="record['status']"
          :checkedChildren="t('common.enable')"
          :unCheckedChildren="t('common.disenabled')"
          :checkedValue="1"
          :unCheckedValue="0"
          @click="(checked, e) => changeStatus(record, column.dataIndex, e)"
        ></Switch>
      </template>
       <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                auth:route.name+':'+PerEnum.ADDC,
                label: `${getPermissionInfo(route.name+':'+PerEnum.ADDC)?.name}`,
                icon: `${getPermissionInfo(route.name+':'+PerEnum.ADDC)?.menuIcon}`,
                onClick: handleCreateChild.bind(null, record),
              }
            ]"
          />
        </template>
    </template>
  </BasicTable>
  <GroupDrawer @register="registerDrawer" @success="handleSuccess" />
</template>
<script lang="ts">
  import { defineComponent, ref, unref, computed } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getGroupTree, deleteByIds, getInfo, updateInfo } from '/@/api/org/group';
  import { PageWrapper } from '/@/components/Page';
  import GroupDrawer from './GroupDrawer.vue';
  import { GroupInfo } from '/@/api/org/model/groupModel';
  
  import {
    Tag,
    Popconfirm,
    Avatar,
    Spin,
    Space,
    Switch,
    Image,
  } from 'ant-design-vue';
  import { Button } from '/@/components/Button'
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PerEnum } from '/@/enums/perEnum';
  import { Authority } from '/@/components/Authority';
  import { Icon } from '/@/components/Icon';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useRoute } from 'vue-router';
  import { useDrawer } from '/@/components/Drawer';
  const { createWarningModal } = useMessage();
  import { columns, searchFormSchema } from './groupInfo.data';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { GroupLabelLocaleLang  } from '/@/enums/appEnum'
  import { useLocale } from '/@/locales/useLocale';
  const { getLocale } = useLocale();
  export default defineComponent({
    name: 'PersonalManagement',
    components: {
      BasicTable,
      Spin,
      Space,
      PageWrapper,
      
      GroupDrawer,
      TableAction,
      Avatar,
      Popconfirm,
      Tag,
      Image,
      Switch,
      Authority,
      Button,
      Icon,
    },
    setup(_, { emit }) {
      const { t } = useI18n();
      let disabled = ref(<boolean>true);
      let isEdit = ref(<boolean>false);
      let selectIndex = ref('')
      const { getPermissionInfo } = usePermission();
      const route = useRoute();
      const [registerDrawer, { openDrawer, setDrawerProps }] = useDrawer();
      const [
        registerTable,
        {
          reload,
          setLoading,
          clearSelectedRowKeys,
          getSelectRowKeys,
          getSelectRows,
        },
      ] = useTable({
        api: getGroupTree,
        clickToRowSelect:false,
        rowClassName:rowClassNameFn,
        customRow:handleClickRow,
        isTreeTable: true,
        columns,
        // immediate: false,
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
          onChange: rowSelectionChange,
        },
        showTableSetting: true,
        useSearchForm: true,
        showIndexColumn: false,
        bordered: true,
        actionColumn: {
          width: 100,
          title: t('common.operating'),
          dataIndex: 'action',
          fixed:'right'
        },
      });
      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
        setDrawerProps({
          showFooter: true,
          width:'calc((100% - 220px)*(1/3))'
        });
      }

      function handleCreateChild(record: Recordable, e) {
        console.log('record',record,e)
        e.stopPropagation();
        const data = {
          parentId: record.id,
          status: 1
        };
        openDrawer(true, {
          record: data,
          isUpdate: false,
        });
        const key = GroupLabelLocaleLang[getLocale.value]
        setDrawerProps({title: t('views.groupInfo.addItemModalTitle',[record[key]]),width:'calc((100% - 220px)*(1/3))'});
      }

      async function handleEdit() {
        const rows = getSelectRows()
        if(rows){
          let record = rows[0]
          setLoading(true);
          const data: GroupInfo = await getInfo(record.id);
          setLoading(false);
          openDrawer(true, {
            record: data,
            isUpdate: true,
          });
          setDrawerProps({
            showFooter: true,
            width:'calc((100% - 220px)*(1/3))'
          });
        }
      }

      function handleClickRow(record,index){
        return {
          onClick:(e) => {
            selectIndex.value = index
            emit('click-row', record)
          }
        }
      }
      function rowClassNameFn(record,index){
        return index === selectIndex.value ? 'click-active' : ''
      }

      function handleDelete(record?: Recordable, e) {
        e && e.stopPropagation();
        let DeleteItem = [];
        if (record) {
          DeleteItem = [record];
        } else {
          DeleteItem = getSelectRows();
        }
        createWarningModal({
          title: t('common.prompt'),
          content: `${t('common.delItemMsg')}`,
          closable: true,
          okCancel: true,
          onOk: () => {
            setLoading(true);
            deleteByIds({ ids: DeleteItem.map((i) => i.id).join(',') })
              .then(() => {
                setLoading(false);
                clearSelectedRowKeys();
                rowSelectionChange(getSelectRowKeys());
                reload();
              })
              .catch(() => {
                setLoading(false);
              });
          },
        });
      }

      function doSearch() {
        reload();
      }

      function handleSuccess() {
        clearSelectedRowKeys();
        rowSelectionChange(getSelectRowKeys());
        reload();
      }

      function changeStatus(record, field, e) {
        e.stopPropagation();
        // console.log('field', record, field);
        let params = {
          id: record.id,
        };
        params[field] = record[field] ? 0 : 1;
        let message = {
          0: '',
          1: '',
        };
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
          okCancel: true,
          onOk: () => {
            setLoading(true);
            updateInfo(params)
              .then(() => {
                setLoading(false);
                reload();
              })
              .catch(() => {
                setLoading(false);
              });
          },
        });
      }

      function rowSelectionChange(value) {
        disabled.value = value?.length ? false : true;
        isEdit.value = value?.length ? (value?.length == 1 ? true : false) : false
      }
      return {
        handleCreateChild,
        registerDrawer,
        rowSelectionChange,
        rowClassNameFn,
        handleClickRow,
        disabled,
        isEdit,
        route,
        getPermissionInfo,
        PerEnum,
        registerTable,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        doSearch,
        changeStatus,
        t,
      };
    },
  });
</script>

<style lang="less">
  // .personal-roles {
  //   .ant-space-align-center {
  //     flex-flow: wrap;
  //     .role-item {
  //       margin: 2px 0;
  //     }
  //   }
  // }
  // .personal-tree {
  //   .scrollbar__wrap {
  //     height: 550px;
  //     overflow-y: scroll;
  //   }
  // }
</style>
