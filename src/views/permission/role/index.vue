<template>
  <PageWrapper fixedHeight contentClass="flex relative">
    <BasicTable @register="registerTable" class="w-1/2 table-custom-click-active-conent" style="height:auto">
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
        <Authority :value="route.name+':'+PerEnum.UPDATE">
          <Button type="primary" @click="handleEdit" :disabled="!isEdit"  color="warning"> 
            <template #icon>
              <Icon v-if="getPermissionInfo(route.name+':'+PerEnum.UPDATE)?.menuIcon" 
              :icon="getPermissionInfo(route.name+':'+PerEnum.UPDATE)?.menuIcon"></Icon>
            </template>
            {{getPermissionInfo(route.name + ':' + PerEnum.UPDATE)?.name}} 
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
          :unCheckedValue='0' @click="(checked,e)=>changeStatus(record,column.key,e)"></Switch>
        </template>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              auth:route.name+':'+PerEnum.UPDATE,
              label: `${getPermissionInfo(route.name + ':' + PerEnum.UPDATE)?.name}`,
              // icon: `${getPermissionInfo(route.name+':'+PerEnum.UPDATE)?.menuIcon}`,
              onClick: handleEdit.bind(null,record),
            },
          ]"
        />
      </template>
    </BasicTable>
    <div class="splitpanes__splitter"></div>
    <div class="w-1/2 bg-white">
      <!-- roleTypeMap1:'用户角色',
        roleTypeMap2:'组织角色',
        roleTypeMap3:'职位角色',
        roleTypeMap4:'用户组角色', -->
        <div v-show="selectNode?.roleType == 1" class="scale-up-hor-left">
          <UserRole :selectRole="selectNode" ref="UserRoleNode"/>
        </div>
        <div v-show="selectNode?.roleType == 2" class="scale-up-hor-left">
          <CordRole :selectRole="selectNode" ref="CordRoleNode"/>
        </div>
        <div v-show="selectNode?.roleType == 3" class="scale-up-hor-left">
          <PositionRole :selectRole="selectNode" ref="PositionRoleNode"/>
        </div>
        <div v-show="selectNode?.roleType == 4" class="scale-up-hor-left">
          <GroupRole :selectRole="selectNode" ref="GroupRoleNode"/>
        </div>
    </div>
    <RoleDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref,computed,nextTick } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { Icon } from "/@/components/Icon";
  import { PerEnum } from "/@/enums/perEnum";
  import { Authority } from "/@/components/Authority";
  import { usePermission } from '/@/hooks/web/usePermission';
  import { Switch } from 'ant-design-vue'
  import { Button } from '/@/components/Button'
  import { useRoute } from 'vue-router'
  import UserRole from './modules/UserRole.vue'
  import PositionRole from './modules/PositionRole.vue'
  import GroupRole from './modules/GroupRole.vue'
  import CordRole from './modules/CordRole.vue'
  import {
    getRoleListByPage,
    deleteByIds,
    getInfo,
    updateInfo,
  } from '/@/api/org/role';
  import { columns, searchFormSchema } from './role.data';
  import RoleDrawer from './RoleDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { RoleInfo } from '/@/api/org/model/roleModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
export default defineComponent({
  name: 'Role',
  components: { BasicTable, TableAction, RoleDrawer,Icon,Button, 
    PageWrapper,
    UserRole,
    PositionRole,
    GroupRole,
    CordRole,
    Switch,Authority },
  setup() {
    const { t } = useI18n();
      let disabled = ref(<boolean>true)
      let isEdit = ref(<boolean>false)
      let selectIndex = ref('')
      let UserRoleNode = ref()
      let PositionRoleNode = ref()
      let CordRoleNode = ref()
      let GroupRoleNode = ref()
      let selectNode = ref({
        roleType: 1
      })
      const { createWarningModal } = useMessage();
      const { getPermissionInfo } = usePermission();
      const route = useRoute()
      const [registerDrawer, { openDrawer,setDrawerProps }] = useDrawer();
      const [registerTable, { reload, setLoading ,clearSelectedRowKeys, getSelectRowKeys ,getSelectRows}] = useTable({
        api: getRoleListByPage,
        columns,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          showAdvancedButton: true,
          showResetButton: true,
          autoSubmitOnEnter: true,
        },
        clickToRowSelect:false,
        rowClassName:rowClassNameFn,
        customRow:handleClickRow,
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
        // actionColumn: {
        //   width: 50,
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
        setDrawerProps({ width:'calc((100% - 220px)*(1/3))'  });
      }

      async function handleEdit() {
        const rows = getSelectRows()
        if(rows){
          let record = rows[0]
          setLoading(true);
          const data: RoleInfo = await getInfo(record.id);
          setLoading(false);
          openDrawer(true, {
            record: data,
            isUpdate: true,
          });
          setDrawerProps({ width:'calc((100% - 220px)*(1/3))'  });
        }
        // e.stopPropagation();
      }

      function handleSuccess(){
        clearSelectedRowKeys();
        rowSelectionChange(getSelectRowKeys());
        reload();
      }

      function handleDelete(record?: Recordable) {
        // e && e.stopPropagation();
        let DeleteItem = []
        if (record) {
          DeleteItem = [record]
        } else {
          DeleteItem = getSelectRows()
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
        isEdit.value = value?.length ? (value?.length == 1 ? true : false) : false
      }
      function handleClickRow(record,index){
        return {
          onClick:(e) => {
            selectIndex.value = index
            selectNode.value = record
            nextTick(()=>{
              if(record.roleType == 1){
                UserRoleNode?.value?.fetch()
              }
              if(record.roleType == 2){
                CordRoleNode?.value?.fetch()
              }
              if(record.roleType == 3){
                PositionRoleNode?.value?.fetch()
              }
              if(record.roleType == 4){
                GroupRoleNode?.value?.fetch()
              }
            })
           
            // 获取角色类型 展示对应的授权
          }
        }
      }
      function rowClassNameFn(record,index){
        return index === selectIndex.value ? 'click-active' : ''
      }

      return {
        UserRoleNode,
        PositionRoleNode,
        CordRoleNode,
        GroupRoleNode,
        selectNode,
        disabled,
        isEdit,
        handleClickRow,
        rowClassNameFn,
        rowSelectionChange,
        getSelectRowKeys,
        route,
        getPermissionInfo,
        PerEnum,
        registerTable,
        registerDrawer,
        // registerDrawer1,
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