<template>
  <BasicDrawer
    wrapClassName="selector-body"
    v-bind="$attrs"
    @register="registerDrawer"
    @close="closeFn"
  >
    <div class="flex">
      <BasicTable
        @register="registerTable"
        class="w-2/3"
      >
      <template #toolbar>
        <Authority :value="'PersonalManagement'+':'+PerEnum.AUTH" >
          <Button type="primary" @click="handleSubmit" :disabled="disabled"> 
            <template #icon>
              <Icon v-if="getPermissionInfo('PersonalManagement'+':'+PerEnum.AUTH)?.menuIcon" 
              :icon="getPermissionInfo('PersonalManagement'+':'+PerEnum.AUTH)?.menuIcon"></Icon>
            </template>
            {{getPermissionInfo('PersonalManagement' + ':' + PerEnum.AUTH)?.name}} 
          </Button>
        </Authority>
      </template>
      </BasicTable>
      <BasicTable
      class="w-1/3"
        @register="registerTableRoleAuth"
      >
      <template #toolbar>
        <Authority :value="'PersonalManagement'+':'+PerEnum.ROLEAUTHCANCEL" >
          <Button type="primary" danger  @click="cancelFn"  :disabled="cancelAuthDisabled"> 
            <template #icon>
              <Icon v-if="getPermissionInfo('PersonalManagement'+':'+PerEnum.ROLEAUTHCANCEL)?.menuIcon" 
              :icon="getPermissionInfo('PersonalManagement'+':'+PerEnum.ROLEAUTHCANCEL)?.menuIcon"></Icon>
            </template>
            {{getPermissionInfo('PersonalManagement' + ':' + PerEnum.ROLEAUTHCANCEL)?.name}} 
          </Button>
        </Authority>
      </template>
      </BasicTable>
    </div>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, computed, ref, watch, onMounted, nextTick } from 'vue';
  import { BasicDrawer, useDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getRoleListByPage } from '/@/api/org/role';
  import { getInfo,updateInfo } from '/@/api/org/personal';
  import { PageWrapper } from '/@/components/Page';
  import OrgTree from '/@/views/components/leftTree/OrgTree.vue';
  import { Tag, Transfer,InputSearch } from 'ant-design-vue';
  import { Button } from '/@/components/Button'
  import { columns,columnsAuth, searchFormSchema } from './role.data';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage, createWarningModal } = useMessage();
  import { PerEnum } from "/@/enums/perEnum";
  import { Authority } from "/@/components/Authority";
  import { usePermission } from '/@/hooks/web/usePermission';
  import { isArray,concat,uniq } from 'lodash-es';
  export default defineComponent({
    props: {
      title: {
        type: String,
        default: '',
      },
    },
    name: 'PersonalSelector',
    components: { BasicDrawer, BasicTable,Authority,Button, PageWrapper, OrgTree, TableAction, Tag ,Transfer},
    setup(_, { emit }) {
      const { getPermissionInfo } = usePermission();
      const { t } = useI18n();
      const selectedList = ref([]);
      const userInfo = ref({});
      const disabled = ref(true);
      const cancelAuthDisabled = ref(true);

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        userInfo.value = data.userInfo;
        reloadRoleAuthPage()
        reload();
      });

      const [registerTable, { reload, setProps ,getSelectRowKeys,clearSelectedRowKeys}] =
        useTable({
          title: t('views.components.roleSelector.roleList'),
          api: getRoleListByPage,
          columns,
          immediate: false,
          rowSelection: {
            type: 'checkbox',
            columnWidth: 30,
            onChange:rowRoleSelectionChange
          },
          afterFetch: () => {
            resetSelect()
          },
          formConfig: {
            labelWidth: 80,
            schemas: searchFormSchema,
            showResetButton: true,
            showAdvancedButton: false,
            autoSubmitOnEnter: true,
            actionColOptions: {
              span: 6,
            },
          },
          searchInfo: {
            status: 1,
          },
          clickToRowSelect: true,
          clearSelectOnPageChange:true,
          rowKey: 'id',
          size: 'small',
          canColDrag: true,
          useSearchForm: true,
          showTableSetting: false,
          showIndexColumn: false,
          bordered: true,
        });
      const [registerTableRoleAuth, {getForm,setLoading, setProps:setRoleProps,setTableData,getDataSource ,clearSelectedRowKeys:clearRoleAuthSelectedRowKeys,getSelectRowKeys:getRoleAuthSelectRowKeys}] =
        useTable({
          title: t('views.components.roleSelector.authRoleList'),
          // api: GetAuthRoleByDept,
          columns:columnsAuth,
          immediate: false,
          rowSelection: {
            type: 'checkbox',
            columnWidth: 30,
            onChange:rowRoleAuthSelectionChange
          },
          // formConfig: {
          //   labelWidth: 80,
          //   schemas: searchFormSchema,
          //   showResetButton: true,
          //   showAdvancedButton: false,
          //   autoSubmitOnEnter: true,
          //   actionColOptions: {
          //     span: 6,
          //   },
          // },
          afterFetch: (data) => {
            resetSelect()
            let { roleName } = getForm().getFieldsValue()
            if (data && data.length) {
              return data.filter(item => {
                if (roleName) {
                  if (item.roleName.indexOf(roleName) > -1) {
                    return true
                  } else {
                    return false
                  }
                } else {
                  return true
                }
              })
            }
            return []
          },
          searchInfo: {
            status: 1,
          },
          pagination:false,
          clickToRowSelect: true,
          clearSelectOnPageChange:true,
          rowKey: 'id',
          size: 'small',
          canColDrag: true,
          useSearchForm: true,
          showTableSetting: false,
          showIndexColumn: false,
          bordered: true,
        });
      function resetSelect() {
        clearSelectedRowKeys()
        rowRoleSelectionChange([])
        clearRoleAuthSelectedRowKeys()
        rowRoleAuthSelectionChange([])
      }
      async function cancelFn() {
        setDrawerProps({ loading: true });
        try {
          let authKeys = getDataSource().map(item => item.id)
          let cancelKeys = getRoleAuthSelectRowKeys()
          let setAuthKeys = authKeys.filter(e => {
            return !cancelKeys.includes(e)
          })
          await updateInfo({
            id: userInfo.value?.id,
            deptId:userInfo.value?.deptId,
            roleId:setAuthKeys.join(','),
          });
          createMessage.success(t('views.components.roleSelector.authCancelSuccess'));
          reloadRoleAuthPage()
          setDrawerProps({ loading: false });
          resetSelect()
        } catch (error) {
          setDrawerProps({ loading: false });
        }
      }
      async function handleSubmit() {
        setDrawerProps({ loading: true });
        try {
          let authKeys = getDataSource().map(item => item.id)
          let addAuthKeys = getSelectRowKeys()
          let setAuthKeys = authKeys.concat(authKeys,addAuthKeys)
          await updateInfo({
            id: userInfo.value?.id,
            deptId:userInfo.value?.deptId,
            roleId:uniq(setAuthKeys).join(','),
          });

          createMessage.success(t('views.components.roleSelector.authSuccess'));
          setDrawerProps({ loading: false });
          // 授权之后 要重新请求授权列表和清除勾选数据
          reloadRoleAuthPage()
          resetSelect()
        } catch (error) {
          setDrawerProps({ loading: false });
        }
      }

      async function reloadRoleAuthPage() {
        setLoading(true)
        try {
          let userInfoObj = await getInfo(userInfo.value?.id)
          let list = []
          if (userInfoObj.roleId) {
            let arrRoleId = userInfoObj.roleId.split(',')
            let arrRoleName = userInfoObj.roleName.split(',')
            let arrRoleCode = userInfoObj.roleCode.split(',')
            arrRoleId.map((item,index) => {
              list.push({
                id:item,
                roleId:item,
                roleName:arrRoleName[index],
                roleCode:arrRoleCode[index]
              })
            })
          }
          setTableData(list)
          setLoading(false)
        } catch (error) {
          setTableData([])
          setLoading(false)
        }
      }

      function rowRoleSelectionChange(value) {
        disabled.value = value?.length ? false : true
      }

      function rowRoleAuthSelectionChange(value) {
        cancelAuthDisabled.value = value?.length ? false : true
      }

      watch(
        () => selectedList.value,
        (value) => {
          if (!isArray(value)) {
            tagList.value = [];
            return;
          }
          if (isArray(value) && value.length) {
            tagList.value = value;
          }
        },
        { immediate: true },
      );
      function closeFn(){
        emit('close')
      }

      return {
        cancelFn,
        closeFn,
        handleSubmit,
        disabled,
        cancelAuthDisabled,
        rowRoleAuthSelectionChange,
        rowRoleSelectionChange,
        columns,
        registerTable,
        registerTableRoleAuth,
        registerDrawer,
        PerEnum,
        getPermissionInfo,
        t,
      };
    },
  });
</script>

<style lang="less">
  .selector-body {
    .scroll-container {
      .scrollbar__wrap {
        margin-bottom: 0 !important;
        padding: 10px 0px;
      }
    }
    .ant-Drawer-content {
      .scrollbar {
        padding: 0;
        margin: 0;
      }
      .vben-page-wrapper-content {
        > div {
          padding: 0;
        }
      }
      .vben-basic-table-form-container {
        .ant-form {
          margin-bottom: 0;
        }
      }
      .org-tree {
        .scrollbar__wrap {
          height: 380px;
        }
      }
    }
    .ant-Drawer {
      .scrollbar {
        margin: 0;
        padding: 0 6px;
      }
    }
    .org-tree {
      margin-top: 10px;
      margin-left: 10px;
    }

    .selected-items {
      overflow-y: auto;
      margin: 0 10px 0;
      border: 1px dashed #ccc;
      padding: 4px 4px 0;
      min-height: 34px;
      max-height: 60px;
      .ant-tag {
        margin-bottom: 4px;
      }
    }
    .vben-basic-table {
      .ant-table-wrapper {
        padding-top: 0;
      }
    }
  }
  .personal-table-transfer  .ant-transfer-list:first-child {
    width:45%;
    flex: none;
  }
  .personal-table-transfer .ant-transfer-list {
    .ant-transfer-list-header {
      .ant-transfer-list-header-selected span:first-child {
        display: none;
      }
    }
  }
</style>
./role