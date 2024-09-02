<template>
  <PageWrapper fixedHeight contentClass="flex">
    <JobGrade @click-row="handleSelect"/>
    <div class="splitpanes__splitter"></div>
    <BasicTable @register="registerTable"   @expand="getExpandData" class="w-1/2 posotion-table" style="height:auto">
      <template #toolbar>
        <Authority :value="route.name+':'+PerEnum.ADD" >
          <Button @click="handleCreate" type="primary"> 
            <template #icon>
              <Icon v-if="getPermissionInfo(route.name+':'+PerEnum.ADD)?.menuIcon" 
              :icon="getPermissionInfo(route.name+':'+PerEnum.ADD)?.menuIcon"></Icon>
            </template>
            {{getPermissionInfo(route.name + ':' + PerEnum.ADD)?.name}} 
          </Button>
        </Authority>
         <Authority :value="route.name+':'+PerEnum.UPDATE" >
          <Button @click="handleEdit()" danger :disabled="!isEdit" color="warning">
            <template #icon>
              <Icon v-if="getPermissionInfo(route.name+':'+PerEnum.UPDATE)?.menuIcon" 
              :icon="getPermissionInfo(route.name+':'+PerEnum.UPDATE)?.menuIcon"></Icon>
            </template>
            {{getPermissionInfo(route.name + ':' + PerEnum.UPDATE)?.name}} 
          </Button>
        </Authority>
        <Authority :value="route.name+':'+PerEnum.DELETE" >
          <Button  @click="handleDelete()" danger :disabled="disabled" color="error">
            <template #icon>
              <Icon v-if="getPermissionInfo(route.name+':'+PerEnum.DELETE)?.menuIcon" 
              :icon="getPermissionInfo(route.name+':'+PerEnum.DELETE)?.menuIcon"></Icon>
            </template>
            {{getPermissionInfo(route.name + ':' + PerEnum.DELETE)?.name}} 
          </Button>
        </Authority>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'status'">
          <Switch :checked="record['status']" :checkedChildren="t('common.enable')" :unCheckedChildren="t('common.disenabled')" :checkedValue='1' :unCheckedValue='0' @click="(checked,e)=>changeStatus(record,column.dataIndex,e)"></Switch>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <TableAction
            :actions="[
              {
                auth:route.name+':'+PerEnum.ADD_LEVEL,
                label: `${getPermissionInfo(route.name + ':' + PerEnum.ADD_LEVEL)?.name}`,
                // icon: `${getPermissionInfo(route.name+':'+PerEnum.ADD_LEVEL)?.menuIcon}`,
                onClick: handleRank.bind(null, record),
              },
              // {
              //   auth:route.name+':'+PerEnum.DELETE,
              //   label: `${getPermissionInfo(route.name + ':' + PerEnum.DELETE)?.name}`,
              //   // icon: `${getPermissionInfo(route.name+':'+PerEnum.DELETE)?.menuIcon}`,
              //   color: 'error',
              //   onClick: handleDelete.bind(null, record),
              // },
            ]"
          />
        </template>
      </template>
      <template #expandedRowRender>
        <BasicTable @register="registerTableRank" class="benchtable">
          <template #bodyCell="data">
            <template v-if="data.column.dataIndex === 'action'">
            <TableAction
              :actions="[
                {
                  auth:route.name+':'+PerEnum.DELETE_RANK,
                  label: `${getPermissionInfo(route.name + ':' + PerEnum.DELETE_RANK)?.name}`,
                  icon: `${getPermissionInfo(route.name+':'+PerEnum.DELETE_RANK)?.menuIcon}`,
                  color: 'error',
                  onClick: handleDeleteRank.bind(null, data.record),
                },
              ]"
            />
          </template>
            </template>
        </BasicTable>
      </template>
    </BasicTable>
    <PositionInfoDrawer @register="registerDrawer" @success="handleSuccess" />
    <JobRankDrawer @register="registerDrawerRank" @success="handleSuccessRank" />
  </PageWrapper>
</template>
<script lang="ts">
  import JobGradeList from '/@/views/components/leftTree/JobGradeList.vue';
  
  import { defineComponent, ref, unref,computed } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getPostPage, getInfo,deleteByIds ,updateInfo} from '/@/api/org/positionInfo';
  import { getJobRanks } from '/@/api/org/jobRank';
  import { columns as columnsRank} from './jobRank/jobRank.data'
  import { PageWrapper } from '/@/components/Page';
  import { useDrawer } from '/@/components/Drawer';
  import PositionInfoDrawer from './PositionInfoDrawer.vue';
  import JobRankDrawer from './jobRank/JobRankDrawer.vue';
  import { Popconfirm, Tooltip} from "ant-design-vue";
  import { Button } from '/@/components/Button'
  import { PlusOutlined,SyncOutlined,DeleteOutlined,FormOutlined, FastBackwardFilled } from '@ant-design/icons-vue';
  import { getInfo as getInfoRank ,deleteByIds as deleteByIdsRank,updateInfo as updateInfoRank} from "/@/api/org/jobRank";
  import { Switch } from 'ant-design-vue';
  import { columns, searchFormSchema } from './positionInfo.data';
  import JobGrade from './jobGrade/index.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {PerEnum} from '/@/enums/perEnum';
  import {Authority} from "/@/components/Authority";
  import { Icon } from "/@/components/Icon";
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useRoute } from 'vue-router'
  const { createMessage,createWarningModal } = useMessage();
  import { useI18n } from '/@/hooks/web/useI18n';
  export default defineComponent({
    name: 'PositionInfo',
    components: {
      BasicTable,
      PageWrapper,
      
      PositionInfoDrawer,
      JobGrade,
      JobRankDrawer,
      TableAction, 
      Switch, 
      Popconfirm,
      Authority,
      Icon,
      Button,
      JobGradeList,
      PlusOutlined,
      SyncOutlined,
      DeleteOutlined,
      FormOutlined,
      Tooltip
    },
    setup() {
      const { t } = useI18n();
      let disabled = ref(<boolean>true)
      let isEdit = ref(<boolean>false);
      let JobGradeDom = ref(null)
      const { getPermissionInfo } = usePermission();
      const route = useRoute()
      const [registerDrawer, { openDrawer, setDrawerProps }] = useDrawer();
      const [registerDrawerRank, { openDrawer:openRankDrawer, setDrawerProps:setRankDrawerProps }] = useDrawer();
      const currentTreeNode = ref<Recordable>({});

      const [registerTable, { reload, setProps,setLoading,getDataSource,setTableData:setPositionTableData ,clearSelectedRowKeys, getSelectRowKeys ,getSelectRows}] = useTable({
        api: getPostPage,
        columns,
        immediate:false,
        formConfig: {
          labelWidth: 120,
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
        showTableSetting: true,
        canColDrag: true,
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 100,
          title: t('common.operating'),
          dataIndex: 'action',
          fixed:'right'
        },
      });
      const [registerTableRank,{setTableData}] = useTable({
        api: getJobRanks,
        immediate:false,
        columns:columnsRank,
        useSearchForm:false,
        showTableSetting: false,
        canResize:false,
        bordered: true,
        size:'small',
        pagination:false,
        showIndexColumn:false,
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
          record:{
            gradeId:currentTreeNode.value?.id,
            gradeCode:currentTreeNode.value?.gradeCode,
          }
        });
        setDrawerProps({
          showFooter: true,
          width:'calc((100% - 220px)*(1/3))'
        });
      }

      function handleCreateRank() {
        openRankDrawer(true, {
          isUpdate: false,
        });
        setRankDrawerProps({
          width:'calc((100% - 220px)*(1/3))'
        })
      }

      async function handleEdit(record: Recordable,e) {
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

      function handleDelete(record?: Recordable,e) {
        e && e.stopPropagation();
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
      function handleDeleteRank(record?: Recordable,e) {
        e && e.stopPropagation();
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
            deleteByIdsRank({ids:DeleteItem.map(i => i.id).join(',')}).then(() => {
              setLoading(false)
              reload();
            }).catch(() => {
              setLoading(false)
            })
          }
        })
      }

      function handleSuccess() {
        setTimeout(()=>{
          clearSelectedRowKeys();
          rowSelectionChange(getSelectRowKeys());
          handleSelect(currentTreeNode.value);
        }, 200);
      }
      function handleSuccessRank() {
        reload()
      }

      function handleSelect(node:any) {
        console.log('node',node)
        currentTreeNode.value = node;
        let searchInfo = {gradeId: node?node.id:''};
        setProps({searchInfo: searchInfo});
        if(!node){
          setPositionTableData([])
          return
        }
        reload({ searchInfo });
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
      }

      function rowSelectionChange(value) {
        disabled.value = value?.length ? false : true
        isEdit.value = value?.length ? (value?.length == 1 ? true : false) : false
      }
      async function handleRank(record: Recordable,e){
        e.stopPropagation();
        openRankDrawer(true, {
          isUpdate: false,
          record:{
            positionId:record.id,
            positionCode:record.positionCode,
            gradeId:record.gradeId,
            gradeCode:record.gradeCode,
          }
        });
        setRankDrawerProps({
          width:'calc((100% - 220px)*(1/3))'
        })
      }
      async function getExpandData(e, record){
        //该方法绑定在@expand上
        if(e){//展开
          console.log('e, recorde, record',e, record)
          getJobRanks({
            positionId:record.id
          }).then(async res => {
            if (e) { 
              await setProps({
                expandedRowKeys:[record.key]
              })
              console.log('resresres',res)
              await setTableData(res)
            }
          })
        }else{
          // console.log('收起')
          // let data = getDataSource()
          // delete data[record.id]; //收起后删除对应键值对，避免浪费资源，
          await setProps({
            expandedRowKeys:[]
          })
          await setTableData([])
        }
      }
      return {
        rowSelectionChange,
        disabled,
        isEdit,
        getSelectRowKeys,
        route,
        getPermissionInfo,
        PerEnum,
        changeStatus,
        registerTable,
        registerTableRank,
        registerDrawer,
        registerDrawerRank,
        handleCreate,
        handleCreateRank,
        handleEdit,
        handleDelete,
        handleDeleteRank,
        handleSuccess,
        handleSuccessRank,
        handleSelect,
        t,
        getExpandData,
        JobGradeDom,
        handleRank
      };
    },
  });
</script>
<style scoped lang="less">
.benchtable {
  padding: 0 !important;
  /deep/ .ant-table-thead {
    >tr {
      >th {
        background: #e1e5e7;
        color: #515a6e;
      }
    }
  }
}
.posotion-table {
  /deep/ .ant-table-expanded-row-fixed {
    padding: 11px 22px;
  }
}
</style>
