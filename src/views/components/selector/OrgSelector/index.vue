<template>
  <BasicModal
    wrapClassName="select-modal"
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
  >
    <div class="content-table flex">
      <div class="w-1/2 box-show">
        <BasicTree
          search
          checkable
          checkStrictly
          v-model:value="selectedKeys"
          :treeData="treeData"
          ref="basicTreeRef"
          :load-data="onLoadData"
          @check="onCheck"
        />
      </div>
      <div class="w-1/2 box-show">
        <Card title="已选" size="small">
          <template #extra>
            <Icon icon="ant-design:delete-outlined" @click="deleteItem('')"></Icon>
          </template>
          <a-list item-layout="horizontal" size="small" :data-source="selectedList">
            <template #renderItem="{ item, index }">
              <a-list-item class="flex">
                <span>
                  {{ index + 1 }}
                  &nbsp;&nbsp;
                  <a-tag :color="cordTypeMap[item.cordType]?.color">{{
                    cordTypeMap[item.cordType]?.label
                  }}</a-tag>
                  &nbsp;&nbsp;
                  {{ item.cordName }}
                </span>
                <Icon icon="ant-design:delete-outlined" @click="deleteItem(item, index)"></Icon>
              </a-list-item>
            </template>
          </a-list>
        </Card>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { BasicTree, TreeActionType, TreeItem } from '/@/components/Tree';
  import { defineComponent, computed, unref, ref, onMounted, nextTick } from 'vue';
  import { BasicModal, useModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  
  import { getCompanies } from '/@/api/org/company';
  import { getDeptsTreeLeft } from '/@/api/org/dept';
  import { PageWrapper } from '/@/components/Page';
  import { Icon } from '/@/components/Icon';
  import OrgTree from '/@/views/components/leftTree/OrgTree.vue';
  import { Button, Tag } from 'ant-design-vue';
  import { columns, searchFormSchema } from './org.data';
  import { cordTypeMap } from '/@/views/permission/role/modules/data';
  import { Card, List, ListItem } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  export default defineComponent({
    props: {
      title: {
        type: String,
        default: '',
      },
    },
    name: 'OrgSelector',
    components: {
      BasicModal,
      BasicTree,
      BasicTable,
      Card,
      List,
      ListItem,
      PageWrapper,
      Icon,
      OrgTree,
      TableAction,
      Tag,
      
    },
    setup(_, { emit }) {
      let selectedKeys = ref<string[]>([]);
      const treeData = ref<TreeItem[]>([]);
      const { t } = useI18n();
      const basicTreeRef = ref<Nullable<TreeActionType>>(null);
      const selectedList = ref([]);
      const [registerModal, { closeModal }] = useModalInner(async (data) => {
        // 加载已选中项
        selectedList.value = data?.selectedList.map(item => {
          return {
            cordType: item.cordType,
            cordCode: item.cordCode,
            cordName: item.cordName,
            cordId: item.id
          }
        }) || [];
        fetch()
        // reload();
      });

      const getTitle = computed(() => t('views.components.selectOrg'));

      async function fetch() {
        getCompanies({ status: 1 }).then((res) => {
          treeData.value = res as unknown as TreeItem[];
          nextTick(() => {
            selectedKeys.value = selectedList.value.map(item => {
              return item.cordId
            });
            // 加载后展开节层级
            // if(unref(treeData).length < 5){
            //   unref(basicTreeRef)?.filterByLevel(1);
            // }
          });
        });
      }
      async function onLoadData(treeNode) {
        return new Promise((resolve: (value?: unknown) => void) => {
          // if (!treeNode.children) {
          //   resolve();
          //   return;
          // }
          // 通过公司id去获取部门列表
          console.log(treeNode, 'treeNode');
          let params = {
            status: 1,
            companyId: null,
            parentId: null,
          };
          // if (treeNode.deptCode) {
          //   const asyncTreeAction: TreeActionType | null = unref(basicTreeRef);
          //   if (asyncTreeAction) {
          //     asyncTreeAction.setExpandedKeys([
          //       treeNode.eventKey,
          //       ...asyncTreeAction.getExpandedKeys(),
          //     ]);
          //   }
          //   resolve();
          //   return;
          // } else {
          params.companyId = !treeNode.deptCode ? treeNode.id : treeNode.companyId;
          if (treeNode.deptCode) {
            params.parentId = treeNode.id;
          }
          getDeptsTreeLeft(params).then((deptData) => {
            const asyncTreeAction: TreeActionType | null = unref(basicTreeRef);
            if (asyncTreeAction) {
              const nodeChildren = deptData;
              console.log(nodeChildren, 'nodeChildren');
              if (!treeNode.deptCode) {
                asyncTreeAction.insertNodesByKey({
                  parentKey: treeNode.eventKey,
                  list: nodeChildren,
                  node: {
                    key: 'id',
                    title: 'deptName',
                  },
                });
              }
              // asyncTreeAction.setExpandedKeys([
              //   treeNode.eventKey,
              //   ...asyncTreeAction.getExpandedKeys(),
              // ]);
            }
            resolve();
            return;
          });
          // }
        });
      }

      function handleSubmit() {
        emit('success', selectedKeys.value, selectedList.value);
        closeModal();
      }
      function onCheck(checkedKeys, e) {
        // console.log('checkedKeys',checkedKeys)
        // console.log('eee',e)
        if (e.checked) {
          selectedList.value = selectedList.value.concat([
            {
              cordType: e.node?.deptCode ? 2 : 1,
              cordCode: e.node?.deptCode ? e.node?.deptCode : e.node?.companyCode,
              cordName: e.node?.deptCode ? e.node?.deptName : e.node?.companyName,
              cordId: e.node?.id,
            },
          ]);
        } else {
          const index = selectedList.value.findIndex((item) => {
            return item.cordId == e.node?.id;
          });
          if (index > -1) {
            selectedList.value.splice(index, 1);
          }
        }
      }

      function deleteItem(item, index) {
        if (item) {
          selectedList.value.splice(index, 1);
          let list = selectedList.value.map((item) => {
            return item.cordId;
          });
          selectedKeys.value = list;
        } else {
          // 删除所有
          selectedList.value = [];
          selectedKeys.value = [];
        }
      }

      // onMounted(()=>{
      //   fetch()
      // })

      return {
        deleteItem,
        cordTypeMap,
        onCheck,
        selectedKeys,
        basicTreeRef,
        selectedList,
        treeData,
        onLoadData,
        registerModal,
        getTitle,
        handleSubmit,
        t,
      };
    },
  });
</script>

<style lang="less" scoped>
  // .selector-body {
  //   .org-card-tree {
  //     margin:10px;
  //     min-height: 500px;
  //   }
  //   .org-box-show {
  //     box-shadow: 0 2px 8px 0 rgba(99, 99, 99, .2);
  //   }
  // }
</style>
