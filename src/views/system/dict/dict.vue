<template>
  <PageWrapper fixedHeight contentClass="flex relative">
    <BasicTable @register="registerTable" class="w-1/2 table-custom-click-active-conent" style="height:auto">
      <template #toolbar>
        <Authority :value="route.name + ':' + PerEnum.ADD">
          <Button type="primary" @click="handleCreate">
            <template #icon>
              <Icon
                v-if="getPermissionInfo(route.name + ':' + PerEnum.ADD)?.menuIcon"
                :icon="getPermissionInfo(route.name + ':' + PerEnum.ADD)?.menuIcon"
              ></Icon>
            </template>
            {{ getPermissionInfo(route.name + ':' + PerEnum.ADD)?.name }}
          </Button>
        </Authority>
        <Authority :value="route.name + ':' + PerEnum.UPDATE">
          <Button type="primary" @click="handleEdit" :disabled="!isEdit" color="warning">
            <template #icon>
              <Icon
                v-if="getPermissionInfo(route.name + ':' + PerEnum.UPDATE)?.menuIcon"
                :icon="getPermissionInfo(route.name + ':' + PerEnum.UPDATE)?.menuIcon"
              ></Icon>
            </template>
            {{ getPermissionInfo(route.name + ':' + PerEnum.UPDATE)?.name }}
          </Button>
        </Authority>
        <Authority :value="route.name + ':' + PerEnum.DELETE">
          <Button type="primary" @click="handleDelete()" danger :disabled="disabled" color="error">
            <template #icon>
              <Icon
                v-if="getPermissionInfo(route.name + ':' + PerEnum.DELETE)?.menuIcon"
                :icon="getPermissionInfo(route.name + ':' + PerEnum.DELETE)?.menuIcon"
              ></Icon>
            </template>
            {{ getPermissionInfo(route.name + ':' + PerEnum.DELETE)?.name }}
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
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              auth: route.name + ':' + PerEnum.UPDATE,
              label: getPermissionInfo(route.name + ':' + PerEnum.UPDATE)?.name,
              // icon: getPermissionInfo(route.name + ':' + PerEnum.UPDATE)?.menuIcon,
              onClick: handleEdit.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
    <div class="splitpanes__splitter"></div>
    <DictItemList ref="DictItemListRef">
    </DictItemList>
    <DictDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { Icon } from '/@/components/Icon';
  import { PerEnum } from '/@/enums/perEnum';
  import { Authority } from '/@/components/Authority';
  import { PageWrapper } from '/@/components/Page';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { Switch } from 'ant-design-vue';
  import { Button } from '/@/components/Button'
  import { useRoute } from 'vue-router';
  import { getDictPage, getInfo, deleteByIds, updateInfo } from '/@/api/system/dict/dict';
  import DictItemList from './DictItemList.vue'
  import { columns, searchFormSchema } from './dict.data';
  import DictDrawer from './DictDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { DictInfo } from '/@/api/system/dict/dictModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  export default defineComponent({
    name: 'Dict',
    components: { BasicTable, TableAction,DictItemList,
    DictDrawer, Icon, Button, Switch, Authority,PageWrapper },
    setup() {
      const { t } = useI18n();
      let selectIndex = ref('')
      let disabled = ref(<boolean>true);
      let isEdit = ref(<boolean>false)
      const DictItemListRef = ref(null)
      const { createWarningModal } = useMessage();
      const { getPermissionInfo } = usePermission();
      const route = useRoute();
      const [registerDrawer, { openDrawer, setDrawerProps }] = useDrawer();
      // const [registerDrawerDictItem, { openDrawer:openDrawerList, setDrawerProps:setDrawerPropsList }] = useDrawer();
      const [
        registerTable,
        { reload, setLoading, clearSelectedRowKeys, getSelectRowKeys, getSelectRows },
      ] = useTable({
        api: getDictPage,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          showAdvancedButton: true,
          showResetButton: true,
          autoSubmitOnEnter: true,
        },
        rowClassName:rowClassNameFn,
        customRow:handleClickRow,
        rowSelection: {
          type: 'checkbox',
          columnWidth: 30,
          onChange: rowSelectionChange,
        },
        showTableSetting: true,
        canColDrag: true,
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        // actionColumn: {
        //   width:80,
        //   title: t('common.operating'),
        //   dataIndex: 'action',
        //   fixed: 'right',
        //   slots: { customRender: 'action' },
        // },
      });

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
        setDrawerProps({
          width:'calc((100% - 220px)*(1/3))'
        });
      }

      async function handleEdit() {
        const rows = getSelectRows()
        if(rows && rows.length){
          const record = rows[0]
          setLoading(true);
          const data: DictInfo = await getInfo(record.id);
          setLoading(false);
          openDrawer(true, {
            record: data,
            isUpdate: true,
          });
          setDrawerProps({
            width:'calc((100% - 220px)*(1/3))'
          });
        }
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
          content: t('common.delItemMsg'),
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
      function handleSuccess() {
        setTimeout(() => {
          clearSelectedRowKeys();
          rowSelectionChange(getSelectRowKeys());
          reload();
        }, 200);
      }
      function changeStatus(record, field, e) {
        e.stopPropagation();
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

      function handleClickRow(record,index){
        return {
          onClick:(e) => {
            selectIndex.value = index
            DictItemListRef?.value?.fetch(record)
            // 获取角色类型 展示对应的授权
          }
        }
      }
      function rowClassNameFn(record,index){
        return index === selectIndex.value ? 'click-active' : ''
      }

      return {
        DictItemListRef,
        disabled,
        isEdit,
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
        t,
      };
    },
  });
</script>
