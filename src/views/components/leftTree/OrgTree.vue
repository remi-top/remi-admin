<template>
  <div class="org-tree bg-white overflow-hidden" v-loading="treeLoading">
    <BasicTree
      search
      :clickRowToExpand="false"
      :treeData="treeData"
      :replaceFields="{ key: 'id', title: 'shortName' }"
      @select="handleSelect"
      ref="basicTreeRef"
      :load-data="onLoadData"
      class="scrollbar__wrap"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, unref, nextTick } from 'vue';
  import {Spin} from "ant-design-vue";
  import { BasicTree, TreeActionType, TreeItem } from '/@/components/Tree';
  import { getCompanies } from '/@/api/org/company';
  import { getDeptsTreeLeft } from '/@/api/org/dept';
  import { useI18n } from '/@/hooks/web/useI18n';
  export default defineComponent({
    name: 'OrgTree',
    components: { BasicTree, Spin },
    
    emits: ['select'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const treeData = ref<TreeItem[]>([]);
      const treeLoading = ref<boolean>(false);
      const basicTreeRef = ref<Nullable<TreeActionType>>(null);

      async function fetch() {
        treeLoading.value = true;
        getCompanies({status:1}).then(res => {
          treeData.value = (res as unknown) as TreeItem[];
          // nextTick(() => {
          //   // 加载后展开节层级
          //   if(unref(treeData).length < 10){
          //     unref(basicTreeRef)?.filterByLevel(1);
          //   }
          // });
        }).finally(()=>{
          treeLoading.value = false;
        });
      }
      function handleSelect(keys: string, e) {
        const asyncTreeAction: TreeActionType | null = unref(basicTreeRef);
        if (asyncTreeAction) {
          const data = asyncTreeAction.getSelectedNode(keys[0]);
          emit('select', data);
        } else {
          emit('select', {});
        }
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
            status:1,
            companyId: null,
            parentId:null
          }
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
            params.companyId = !treeNode.deptCode ? treeNode.id : treeNode.companyId
            if (treeNode.deptCode) {
              params.parentId = treeNode.id
            }
            getDeptsTreeLeft(params).then(deptData => {
              const asyncTreeAction: TreeActionType | null = unref(basicTreeRef);
              if (asyncTreeAction) {
                const nodeChildren = deptData
                console.log(nodeChildren,'nodeChildren');
                if (!treeNode.deptCode) {
                  asyncTreeAction.insertNodesByKey({
                    parentKey: treeNode.eventKey,
                    list: nodeChildren,
                    node: {
                      key: 'id',
                      title: 'deptName'
                    }
                  });
                }
                // asyncTreeAction.setExpandedKeys([
                //   treeNode.eventKey,
                //   ...asyncTreeAction.getExpandedKeys(),
                // ]);
              }
              resolve();
              return;
            })
          // }
        });
      }
      onMounted(() => {
        fetch();
      });
      return { treeData, treeLoading, basicTreeRef, handleSelect ,onLoadData,t};
    },
  });
</script>
