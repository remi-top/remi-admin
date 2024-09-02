<template>
  <PageWrapper fixedHeight contentClass="flex">
    <AppIconTree class="mr-2 w-1/5" @select="handleSelect" />
    <BasicTable @register="registerTable" class="w-4/5 flex-1" style="height: auto">
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
        <Button type="primary" @click="handleExpandAll">
          <template #icon>
            <Icon icon="ant-design:column-height-outlined"></Icon>
          </template>
          {{
            (isExpandAll ? t('component.form.putAway') : t('component.form.unfold'))
          }}
        </Button>
      </template>
    </BasicTable>
    <GruopSelectorModal @register="registerModal" @success="handleSuccess" />
    <!-- <PValueSettingModal @register="registerPValueModal" @success="handleSuccess" /> -->
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref, nextTick, computed } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getAppGroupTree, updateInfo } from '/@/api/org/appGroup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PageWrapper } from '/@/components/Page';
  import { columns, searchFormSchema } from './groupInfo.data';
  import AppIconTree from '/@/views/components/leftTree/AppIconTree.vue';
  import GruopSelectorModal from '/@/views/components/selector/GruopSelector/index.vue'

  import { useModal } from '/@/components/Modal';
  import { Icon } from '/@/components/Icon';
  import { PerEnum } from '/@/enums/perEnum';
  import { Authority } from '/@/components/Authority';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { Button } from '/@/components/Button';
  import { useRoute } from 'vue-router';
  const { createWarningModal, createMessage } = useMessage();
  import { Switch } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { eachTree } from '/@/utils/helper/treeHelper'
  import { MenuLocaleLang } from '/@/enums/appEnum';
  import { useLocale } from '/@/locales/useLocale';
  const { getLocale } = useLocale();
  export default defineComponent({
    name: 'AppOrganization',
    components: {
      BasicTable,
      TableAction,
      GruopSelectorModal,
      Switch,
      PageWrapper,
      AppIconTree,
      Button,
      Authority,
      Icon,
    },
    setup() {
      const { t } = useI18n();
      const isExpandAll = ref(false);
      let disabled = ref(<boolean>true);
      const { getPermissionInfo } = usePermission();
      const route = useRoute();
      const currentNode = ref<Recordable>({});
      const [registerModal, { openModal, setModalProps }] = useModal();
      const [
        registerTable,
        {
          reload,
          getDataSource,
          setProps,
          expandAll,
          collapseAll,
          setLoading,
          clearSelectedRowKeys,
          getSelectRowKeys,
          getSelectRows,
        },
      ] = useTable({
        api: getAppGroupTree,
        columns,
        immediate: false,
        isTreeTable: true,
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
          onChange: rowSelectionChange,
        },
        rowKey: 'id',
        showTableSetting: true,
        canColDrag: true,
        useSearchForm: true,
        pagination: false,
        bordered: true,
        showIndexColumn: false,
        // actionColumn: {
        //   width: 170,
        //   title: t('common.operating'),
        //   dataIndex: 'action',
        //   fixed: 'right',
        // },
      });

      function handleExpandAll() {
        if (isExpandAll.value) {
          collapseAll();
        } else {
          expandAll();
        }
        isExpandAll.value = !unref(isExpandAll);
      }
      function handleCreate() {
        if(!unref(currentNode)?.id){
          createMessage.warning(t('views.components.selectAppText'))
          return
        }
        setModalProps({ width: '70%' });
        let selectedData = getDataSource();
        let selectedList = []
        eachTree(selectedData, (item) => {
          selectedList.push(item)
        })
        openModal(true, {
          selectedList,
          isUpdate: false,
          isCheckParentNodes: true
        });
      }

      function handleDelete(record?: Recordable, e) {
        e && e.stopPropagation();
        let DeleteItem = [];
        if (record) {
          DeleteItem = [record];
        } else {
          DeleteItem = getSelectRows();
        }
        let flag = DeleteItem.find((item) => item.children && item.children.length > 0);
        if (flag) {
          createWarningModal({
            title: t('common.prompt'),
            content: t('views.menu.delItemMsg'),
          });
          return;
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

      async function handleSuccess(selectedOrgKeys,selectedOrgs: any) {
        console.log('selectedOrgs', selectedOrgs);
        try {
          if (selectedOrgs && selectedOrgs.length) {
            setLoading(true);
            let arr = selectedOrgs.map((item) => {
              return {
                appId: unref(currentNode)?.id,
                appCode: unref(currentNode)?.appCode,
                groupId: item.id,
                groupCode: item.groupCode,
                status: 1
              };
            });
            await updateInfo(arr);
            setLoading(false);
            reload();
          } else {
            setLoading(true);
            await updateInfo([]);
            setLoading(false);
            reload();
          }
        } catch (error) {
          setLoading(false);
        }
      }

      function handleSelect(node: any) {
        console.log('nodevnode', node);
        currentNode.value = node;
        setProps({ searchInfo: { appId: node ? node.id : '' } });
        reload();
      }

      function rowSelectionChange(value) {
        disabled.value = value?.length ? false : true;
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
        registerModal,
        handleExpandAll,
        handleSelect,
        handleCreate,
        handleDelete,
        handleSuccess,
        t,
      };
    },
  });
</script>
