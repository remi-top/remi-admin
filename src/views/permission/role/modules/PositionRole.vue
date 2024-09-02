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
  <PositionSelectModal @register="registerPositionSelectorModal"  @success="handleSuccess" />
</template>
<script lang="ts">
  
  import PositionSelectModal from '/@/views/components/selector/PositionSelector/index.vue'
  import { defineComponent, ref, unref, onMounted, computed } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import {
    getPositionRoleListByPage,
    deleteByIds,
    saveInfo,
    } from '/@/api/permission/positionRole';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import { Popconfirm, Tooltip } from 'ant-design-vue';
  import { Button } from '/@/components/Button'
  import { PlusOutlined, SyncOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons-vue';
  import { Switch } from 'ant-design-vue';
  import { columnsPosition, searchPositionFormSchema } from './data';
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
      PositionSelectModal,
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
      let PositionDom = ref(null);
      const { getPermissionInfo } = usePermission();
      const route = useRoute();
      const [
        registerPositionSelectorModal,
        { openModal, setModalProps },
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
          api: getPositionRoleListByPage,
          columns:columnsPosition,
        immediate: false,
        formConfig: {
          // labelWidth: 100,
            schemas: searchPositionFormSchema,
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
        //   createMessage.warning(t('views.components.userPositionSelectText'));
        //   return;
        }
        openModal(true, {
          isUpdate: false,
          // record: {
          //   postId: currentTreeNode.value?.id,
          //   postCode: currentTreeNode.value?.positionCode,
          // },
          multiSelect:true,
          selectedList: [],
        });
        setModalProps({
          width: '70%',
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

      async function handleSuccess(selectedList) {
         try {
          if (selectedList && selectedList.length) {
            setLoading(true);
            let arr = selectedList.map((item) => {
              return {
                postId: item.id,
              postCode: item.positionCode,
              status: 1,
              roleId:props.selectRole.id,
              roleCode:props.selectRole.roleCode
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

      onMounted(() => {
      });
      return {
        fetch,
        rowSelectionChange,
        disabled,
        getSelectRowKeys,
        route,
        getPermissionInfo,
        PerEnum,
        registerTable,
        registerPositionSelectorModal,
        handleCreate,
        handleDelete,
        handleSuccess,
        t,
        PositionDom,
      };
    },
  });
</script>
<style scoped lang="scss"></style>
