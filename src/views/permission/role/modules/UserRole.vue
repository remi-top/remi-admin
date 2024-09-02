<template>
  <BasicTable @register="registerTable">
    <template #toolbar>
      <Authority :value="'Role' + ':' + PerEnum.ADD">
        <Button type="primary" @click="handleCreate">
          <template #icon>
            <Icon
              v-if="getPermissionInfo('Role' + ':' + PerEnum.ADD)?.menuIcon"
              :icon="getPermissionInfo('Role' + ':' + PerEnum.ADD)?.menuIcon"
            ></Icon>
          </template>
          {{ getPermissionInfo('Role' + ':' + PerEnum.ADD)?.name }}
        </Button>
      </Authority>
      <Authority :value="'Role' + ':' + PerEnum.DELETE">
        <Button type="primary" @click="handleDelete()" danger :disabled="disabled" color="error">
          <template #icon>
            <Icon
              v-if="getPermissionInfo('Role' + ':' + PerEnum.DELETE)?.menuIcon"
              :icon="getPermissionInfo('Role' + ':' + PerEnum.DELETE)?.menuIcon"
            ></Icon>
          </template>
          {{ getPermissionInfo('Role' + ':' + PerEnum.DELETE)?.name }}
        </Button>
      </Authority>
    </template>
  </BasicTable>
  <PersonalSelector @register="registerPersonalSelectorModal" @success="handleSuccess" />
</template>
<script lang="ts">
  import GroupList from '/@/views/components/leftTree/GroupList.vue';
  
  import { defineComponent, ref, unref, onMounted, watch } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import {
    getUserRoleListByPage,
    getInfo,
    deleteByIds,
    updateInfo,
    saveInfo,
  } from '/@/api/permission/userRole';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import { Popconfirm, Tooltip } from 'ant-design-vue';
  import { Button } from '/@/components/Button'
  import { PlusOutlined, SyncOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons-vue';
  import { Switch } from 'ant-design-vue';
  import { columns, searchFormSchema } from './data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PerEnum } from '/@/enums/perEnum';
  import { Authority } from '/@/components/Authority';
  import { Icon } from '/@/components/Icon';
  import { usePermission } from '/@/hooks/web/usePermission';
  import PersonalSelector from '/@/views/components/selector/personalSelector/index.vue';
  import { useRoute } from 'vue-router';
  const { createMessage, createWarningModal } = useMessage();
  import { useI18n } from '/@/hooks/web/useI18n';
  export default defineComponent({
    name: 'UserRole',
    components: {
      BasicTable,
      PageWrapper,
      
      TableAction,
      Switch,
      Popconfirm,
      Authority,
      Icon,
      Button,
      GroupList,
      PlusOutlined,
      SyncOutlined,
      DeleteOutlined,
      FormOutlined,
      Tooltip,
      PersonalSelector,
    },
    props: {
      selectRole: {
        type: Object,
        default: () => {},
      },
    },
    setup(props) {
      const { t } = useI18n();
      let disabled = ref(<boolean>true);
      let GroupDom = ref(null);
      const { getPermissionInfo } = usePermission();
      const route = useRoute();
      const [
        registerPersonalSelectorModal,
        { openModal: openPersonalSelectorModal, setModalProps },
      ] = useModal();
      const currentTreeNode = ref<Recordable>(null);

      const [
        registerTable,
        {
          reload,
          setProps,
          setLoading,
          getDataSource,
          setTableData: setPositionTableData,
          clearSelectedRowKeys,
          getSelectRowKeys,
          getSelectRows,
        },
      ] = useTable({
        api: getUserRoleListByPage,
        columns,
        immediate: false,
        formConfig: {
          labelWidth: 90,
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
        canColDrag: true,
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        // actionColumn: {
        //   // width: 100,
        //   title: t('common.operating'),
        //   dataIndex: 'action',
        //   fixed:'right'
        // },
      });

      function handleCreate() {
        if (!props.selectRole.id) {
          //   createMessage.warning(t('views.components.userGroupSelectText'));
          //   return;
        }
        openPersonalSelectorModal(true, {
          isUpdate: false,
          // record: {
          //   groupId: currentTreeNode.value?.id,
          //   groupCode: currentTreeNode.value?.groupCode,
          // },
          multiSelect:true,
          selectedList: [],
        });
        setModalProps({
          width: '90%',
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

      async function handleSuccess(selectedPersonals: any) {
        console.log('selectedPersonals', selectedPersonals);
        try {
          if (selectedPersonals && selectedPersonals.length) {
            setLoading(true);
            let arr = selectedPersonals.map((item) => {
              return {
                userId: item.id,
                userCode: item.userCode,
                status: 1,
                roleId: props.selectRole.id,
                roleCode: props.selectRole.roleCode,
              };
            });
            await saveInfo(arr);
            setLoading(false);
            reload();
          }
        } catch (error) {
          setLoading(false);
        }
      }

      function rowSelectionChange(value) {
        disabled.value = value?.length ? false : true;
      }

      function fetch(){
        setProps({
          searchInfo: {
            roleId: props.selectRole?.id,
          }
        })
        reload()
      }


      onMounted(()=>{
        // fetch()
      })

      return {
        fetch,
        rowSelectionChange,
        disabled,
        getSelectRowKeys,
        route,
        getPermissionInfo,
        PerEnum,
        registerTable,
        registerPersonalSelectorModal,
        handleCreate,
        handleDelete,
        handleSuccess,
        t,
        GroupDom,
      };
    },
  });
</script>
<style scoped lang="scss"></style>
