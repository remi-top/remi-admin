<template>
  <BasicModal wrapClassName="select-modal" v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <!-- <div class="selected-items">
      已选：<Tag v-for="item in selectedList" color="processing" closable @close="removeSelectedItem(item.id)">{{item.userName}}</Tag>
    </div> -->
    <div class="content-table flex">
      <div class="w-1/4 xl:w-3/10 box-show">
        <OrgTree  @select="handleSelect" />
      </div>
      <div class="w-2/4 xl:w-4/10 table box-show">
        <BasicTable @register="registerTable" @selection-change="selectionChanged" @row-click="rowClick">
        </BasicTable>
      </div>
      <div class="w-1/4 xl:w-3/10 box-show">
        <Card  title="已选" size="small">
            <template #extra>
              <Icon icon="ant-design:delete-outlined" @click="removeSelectedItem('')"></Icon>
            </template>
              <a-list item-layout="horizontal" size="small" :data-source="selectedList">
                <template #renderItem="{ item,index }">
                  <a-list-item class="flex">
                    <span>
                      {{index+1}}
                      &nbsp;&nbsp;
                      &nbsp;&nbsp;
                      {{item[getNameKey]}}
                    </span>
                    <Icon icon="ant-design:delete-outlined" @click="removeSelectedItem(item,index)"></Icon>
                  </a-list-item>
                </template>
              </a-list>
        </Card>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, computed, ref, onMounted, nextTick } from 'vue';
  import { BasicModal, useModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  
  import { getPersonalPageList } from '/@/api/org/personal';
  import { PageWrapper } from '/@/components/Page';
  import OrgTree from '/@/views/components/leftTree/OrgTree.vue';
  import { Button, Tag,Card } from 'ant-design-vue';
  import { columns, searchFormSchema } from './personal.data';
  import { isArray } from 'lodash-es'
  import { useI18n } from '/@/hooks/web/useI18n';
  import { UserLabelLocaleLang } from '/@/enums/appEnum'
  import { useLocale } from '/@/locales/useLocale';
  const { getLocale } = useLocale();
  export default defineComponent({
    props: {
      title: {
        type: String,
        default: ''
      },
    },
    name: 'PersonalSelector',
    components: {BasicModal,Card, BasicTable, PageWrapper, OrgTree, TableAction, Tag },
    setup(_, {emit}) {
      const { t } = useI18n();
      const selectedList = ref([]);
      const multiSelect = ref<boolean>(false);
      // const [registerModal] = useModal();
      const [registerModal, { closeModal }] = useModalInner(async (data) => {
        const {selectorProps} = data;

        // 加载已选中项
        selectedList.value = selectorProps?.selectedList || [];
        multiSelect.value = selectorProps?.multiSelect || [];
        setSelectedRowKeys(selectedList.value.map(item=>item.id));
        setProps({
          rowSelection:{
            closeOnchange:true,
            type: data.multiSelect?'checkbox':'radio',
            columnWidth: 30,
          }
        });
        // reload();
      });

      // 给表单元素添加回车事件
      // searchFormSchema.forEach((item: object)=>{
      //   if(item){
      //     item['componentProps']['onkeypress'] = (e)=>{
      //       if(e.keyCode === 13){
      //         reload();
      //       }
      //     }
      //   }
      // });

      const [registerTable, { reload, setProps, getSelectRows, setSelectedRowKeys }] = useTable({
        title: '',
        api: getPersonalPageList,
        columns,
        // immediate: false,
        rowSelection: {
          type: 'checkbox',
          columnWidth: 30,
        },
        // searchInfo:{
        //   status:1
        // },
        formConfig: {
          labelWidth:90,
          schemas: searchFormSchema,
          showResetButton: false,
          showAdvancedButton: true,
          autoSubmitOnEnter: true,
        },
        showTableSetting: false,
        clickToRowSelect: true,
        rowKey: 'id',
        size: 'small',
        canColDrag:true,
        canResize:true,
        useSearchForm: true,
        showIndexColumn: false,
        bordered: true,
        // scroll: { y: 280}
      });

      const getTitle = computed(() => (t('views.components.selectUser')));
      const getNameKey = computed(() => UserLabelLocaleLang[getLocale.value]);

      function handleSuccess() {
        reload();
      }

      function removeSelectedItem(record, index) {
        if (record) {
          selectedList.value.splice(
            selectedList.value.findIndex((item: any) => item.id === record.id),
            1,
          );
          setSelectedRowKeys(selectedList.value.map((item: any) => item.id));
        } else {
          // 删除所有
          selectedList.value = [];
          setSelectedRowKeys([]);
        }
      }

      // checkbox/radio选择
      function selectionChanged({ keys, rows }) {
        selectedList.value = rows
      }

      // 行点击
      function rowClick() {
        selectionChanged({rows: getSelectRows()});
      }

      function handleSubmit() {
        const selectedRows = getSelectRows();
        emit('success', selectedRows);
        closeModal();
      }

      // 选择树
      // TODO
      function handleSelect(node:any) {
        let searchInfo = {};
        if(!node){
          // searchInfo = {
          //   status:1
          // }
        } else {
          if(node&&node.deptCode){
            searchInfo = {deptId: node.id};
          }else{
            searchInfo = {companyId: node.id};
          }
        }
        setProps({ searchInfo })
        reload({ searchInfo });
      }

      return {
        registerTable,
        registerModal,
        getTitle,
        getNameKey,
        selectedList,
        removeSelectedItem,
        rowClick,
        selectionChanged,
        handleSubmit,
        handleSuccess,
        handleSelect,
        t
      };
    },
  });
</script>

