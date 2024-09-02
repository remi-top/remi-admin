<template>
  <PageWrapper fixedHeight contentClass="bg-white">
    <BasicTable @register="registerTable" class="flex-1" style="height:auto">
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
     <NoticeDrawer @register="registerDrawer" @success="handleSuccess" />
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
  import { useDrawer } from '/@/components/Drawer';
  import { Button } from '/@/components/Button'
  import { useRoute } from 'vue-router'
  import { getNoticePage, getInfo, deleteByIds } from '/@/api/system/notice/notice';
  import { NoticeInfo } from '/@/api/system/notice/noticeModel';
  import { PageWrapper } from '/@/components/Page';
  import { columns, searchFormSchema } from './notice.data';
  import NoticeDrawer from './NoticeDrawer.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
const { createWarningModal } = useMessage();
export default defineComponent({
  name: 'SystemNotice',
  components: { BasicTable, TableAction,Icon,Button,Switch,Authority,PageWrapper, NoticeDrawer },
  setup() {
      const { t } = useI18n();
      let disabled = ref(<boolean>true)
      let isEdit = ref(<boolean>false)
      const { getPermissionInfo } = usePermission();
      const route = useRoute()
      const [registerDrawer, { openDrawer, setDrawerProps }] = useDrawer();
      const [registerTable, { reload, setLoading, clearSelectedRowKeys, getSelectRowKeys, getSelectRows }] = useTable({
        api: getNoticePage,
        columns:columns,
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
        setDrawerProps({
          width:'calc((100% - 220px)*(2/3))'
        });
      }

      async function handleEdit() {
        const rows = getSelectRows()
        if(rows && rows.length){
          const record = rows[0]
          setLoading(true);
          const data: NoticeInfo = await getInfo(record.id);
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
      function rowSelectionChange(value) {
        disabled.value = value?.length ? false : true;
        isEdit.value = value?.length ? (value?.length == 1 ? true : false) : false
      }

      return {
        disabled,
        isEdit,
        route,
        getPermissionInfo,
        PerEnum,
        registerTable,
        t,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        registerDrawer,
        rowSelectionChange
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
