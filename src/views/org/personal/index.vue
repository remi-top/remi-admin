<template>
  <PageWrapper fixedHeight contentClass="flex">
    <OrgTree class="personal-tree mr-2 w-1/5" @select="handleSelect" />
    <BasicTable @register="registerTable" class="w-4/5" style="height:auto">
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
                auth: route.name + ':' + PerEnum.UPDATE,
                label: `${getPermissionInfo(route.name + ':' + PerEnum.UPDATE)?.name}`,
                icon: `${getPermissionInfo(route.name + ':' + PerEnum.UPDATE)?.menuIcon}`,
                onClick: handleEdit.bind(null, record),
              },
              // {
              //   auth: route.name + ':' + PerEnum.DELETE,
              //   label: `${getPermissionInfo(route.name + ':' + PerEnum.DELETE)?.name}`,
              //   icon: `${getPermissionInfo(route.name + ':' + PerEnum.DELETE)?.menuIcon}`,
              //   color: 'error',
              //   onClick: handleDelete.bind(null, record),
              // },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <PersonalDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref, computed } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getPersonalPageList, deleteByIds, getInfo, updateInfo } from '/@/api/org/personal';
  import { PageWrapper } from '/@/components/Page';
  import OrgTree from '/@/views/components/leftTree/OrgTree.vue';
  import PersonalDrawer from './PersonalDrawer.vue';
  import { PersonalInfo } from '/@/api/org/model/personalModel';
  
  import {
    Tag,
    Popconfirm,
    Avatar,
    Badge,
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
  import { columns, searchFormSchema } from './personal.data';
  import { useI18n } from '/@/hooks/web/useI18n';
  export default defineComponent({
    name: 'PersonalManagement',
    components: {
      BasicTable,
      Spin,
      Space,
      PageWrapper,
      
      OrgTree,
      PersonalDrawer,
      TableAction,
      Avatar,
      Badge,
      Popconfirm,
      Tag,
      Image,
      Switch,
      Authority,
      Button,
      Icon,
    },
    setup() {
      const { t } = useI18n();
      let disabled = ref(<boolean>true);
      const { getPermissionInfo } = usePermission();
      const route = useRoute();
      const deleteRoleLoading = ref<object>({});
      const previewImage = ref<string>('');
      const previewImageVisible = ref<boolean>(false);
      const currentNode = ref<Recordable>({});
      const [registerDrawer, { openDrawer, setDrawerProps }] = useDrawer();
      const [
        registerTable,
        {
          reload,
          setLoading,
          setProps,
          clearSelectedRowKeys,
          setTableData,
          getSelectRowKeys,
          getSelectRows,
        },
      ] = useTable({
        api: getPersonalPageList,
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
          fixed: 'right',
        },
        beforeFetch: (params) => {
          let searchInfo = {};
          if (currentNode.value?.sourceType === '1') {
            searchInfo = { companyId: unref(currentNode).id };
          } else if (currentNode.value?.sourceType === '2') {
            searchInfo = { deptId: unref(currentNode).id };
          }
          return { ...params, ...searchInfo };
        },
      });
      function handleCreate() {
        let record = {};
        if (unref(currentNode)) {
          if (unref(currentNode).deptCode) {
            record = {
              companyId: unref(currentNode).companyId,
              companyCode: unref(currentNode).companyCode,
              deptId: unref(currentNode).id,
              deptCode: unref(currentNode).deptCode,
            };
          } else if (unref(currentNode).companyCode) {
            record = {
              companyId: unref(currentNode).id,
              companyCode: unref(currentNode).companyCode,
            };
          }
        }
        openDrawer(true, {
          isUpdate: false,
          record,
        });
        setDrawerProps({
          showFooter: true,
          width:'calc((100% - 220px)*(2/3))'
        });
      }

      async function handleEdit(record: Recordable, e) {
        e.stopPropagation();
        try {
          
          setLoading(true);
          const data: PersonalInfo = await getInfo(record.id);
          setLoading(false);
          openDrawer(true, {
            record: { ...data },
            isUpdate: true,
          });
          setDrawerProps({
            showFooter: true,
            width:'calc((100% - 220px)*(2/3))'
          });
        } catch (error) {
          setLoading(false);
          
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
        setTimeout(() => {
          reload();
        }, 200);
      }
      function previewImageVisibleChange(visible, prevVisible) {
        previewImageVisible.value = visible;
      }

      function reloadTable() {
        let searchInfo = {};
        // console.log('currentNode',currentNode);
        // TODO
        if (unref(currentNode)?.id) {
          if (currentNode.value?.deptCode) {
            searchInfo = { deptId: unref(currentNode).id };
          } else {
            searchInfo = { companyId: unref(currentNode).id };
          }
          setProps({ searchInfo });
          reload({ searchInfo });
        } else {
          searchInfo = {
            deptId: null,
            companyId: null,
          };
          setTableData([]);
        }
      }

      function handleSelect(node: any) {
        console.log('node', node);
        currentNode.value = node;
        reloadTable();
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
      }
      return {
        registerDrawer,
        rowSelectionChange,
        disabled,
        getSelectRowKeys,
        route,
        getPermissionInfo,
        PerEnum,
        registerTable,
        deleteRoleLoading,
        previewImage,
        previewImageVisible,
        previewImageVisibleChange,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleSelect,
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
