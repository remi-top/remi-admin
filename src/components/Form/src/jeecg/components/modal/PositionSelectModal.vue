<!--职务选择框-->
<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="modalTitle"
    wrapClassName="select-modal"
    @ok="handleOk"
    destroyOnClose
    @visible-change="visibleChange"
  >
  <div class="selected-items" v-if="showSelected">
    已选：<a-tag v-for="item in selectRows" :key="item.id" color="processing" closable @close="handleDeleteSelected(record)">{{props.labelKey}}</a-tag>
  </div>
   <div class="flex content-table">
    <div class="w-1/4 box-show">
      <JobGradeList @select="handleSelectJobGrade" title="" :search="true"/>
    </div>
    <div class="w-3/4 box-show">
      <BasicTable
        ref="tableRef"
        :columns="columns"
        :immediate="false"
        :useSearchForm="true"
        :pagination="true"
        :formConfig="formConfig"
        :api="getPositionInfoPage"
        :searchInfo="searchInfo"
        :rowSelection="rowSelection"
        :indexColumnProps="indexColumnProps"
        v-bind="getBindValue"
      ></BasicTable>
    </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import JobGradeList from '/@/views/components/leftTree/JobGradeList.vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getPositionInfoPage } from '/@/api/org/positionInfo';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useSelectBiz } from '/@/components/Form/src/jeecg/hooks/useSelectBiz';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  export default defineComponent({
    name: 'PositionSelectModal',
    components: {
      JobGradeList,
      PageWrapper,
      //此处需要异步加载BasicTable
      BasicModal,
      BasicTable: createAsyncComponent(() => import('/@/components/Table/src/BasicTable.vue'), {
        loading: true,
      }),
    },
    props: {
      ...selectProps,
      //选择框标题
      modalTitle: {
        type: String,
        default: `${t('common.chooseText')}${t('views.components.position')}`,
      },
    },
    emits: ['register', 'getSelectResult'],
    setup(props, { emit, refs }) {
      const tableRef = ref()
      //注册弹框
      const [register, { closeModal,setModalProps }] = useModalInner((data) => {
      });
      const attrs = useAttrs();
      //表格配置
      const config = {
        canResize: false,
        bordered: true,
        size: 'small',
        //改成读取rowKey,自定义传递参数
        rowKey: props.rowKey,
      };
      const getBindValue = Object.assign({}, unref(props), unref(attrs), config);
      const [{ rowSelection, visibleChange, indexColumnProps, getSelectResult, handleDeleteSelected, selectRows }] = useSelectBiz(
        getPositionInfoPage,
        getBindValue,
        emit
      );
      const searchInfo = ref(props.params);
      //查询form
      const formConfig = {
        labelCol: {
          span: 6,
        },
        baseColProps: {
          xs: 24,
          sm: 10,
          md: 10,
          lg: 10,
          xl: 10,
          xxl: 10,
        },
        //update-begin-author:liusq date:2023-10-30 for: [issues/5514]组件页面显示错位
        actionColOptions: {
            xs: 24,
            sm: 8,
            md: 8,
            lg: 8,
            xl: 8,
            xxl: 8,
        },
        //update-end-author:liusq date:2023-10-30 for: [issues/5514]组件页面显示错位
        schemas: [
          {
            label: t('views.position.positionName'),
            field: 'positionName',
            component: 'Input',
            colProps: { span: 10 },
          },
        ],
        showAdvancedButton:true
      };
      //定义表格列
      const columns = [
        {
          title: t('views.position.positionCode'),
          dataIndex: 'positionCode',
          align: 'left',
          width:120
        },
        {
          title: t('views.position.positionName'),
          dataIndex: 'positionName',
          align: 'left',
        },
      ];
      //已选择的table信息
      const selectedTable = {
        pagination: false,
        showIndexColumn: false,
        scroll: { y: 390 },
        size: 'small',
        canResize: false,
        bordered: true,
        rowKey: 'id',
        columns: [
          {
            title: t('views.position.positionName'),
            dataIndex: 'positionName',
            width: 40,
          },
          {
            title: t('common.operating'),
            dataIndex: 'action',
            align: 'center',
            width: 40,
            slots: { customRender: 'action' },
          },
        ],
      };
      /**
       * 确定选择
       */
      function handleOk() {
        getSelectResult((options, values,selectRows) => {
          console.log('options, values,selectRows',options, values,selectRows)
          //回传选项和已选择的值
          emit('getSelectResult', options, values,selectRows);
          //关闭弹窗
          closeModal();
        });
      }
      function handleSelectJobGrade(currentNode){
        let params = { gradeId: currentNode?currentNode.id:''};
        if(searchInfo.value){
          Object.assign(searchInfo.value,params)
        } else {
          searchInfo.value = params
        }
        if(!currentNode){
          tableRef.value.setTableData([])
          tableRef.value.setProps({
            pagination:{
              total:0
            }
          })
        } else {
          tableRef.value.setProps({
            searchInfo:searchInfo.value
          })
          tableRef.value.reload()
        }
      }
      return {
        handleOk,
        getPositionInfoPage,
        register,
        visibleChange,
        getBindValue,
        formConfig,
        indexColumnProps,
        columns,
        rowSelection,
        tableRef,
        selectedTable,
        selectRows,
        handleDeleteSelected,
        handleSelectJobGrade,
        searchInfo,
      };
    },
  });
</script>

