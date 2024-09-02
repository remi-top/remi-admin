<template>
  <div class="bg-white overflow-hidden" v-loading="treeLoading">
    <slot name="customTool"></slot>
    <BasicTree
      search
      :clickRowToExpand="false"
      :show-icon="false"
      :treeData="treeData"
      :replaceFields="{ key: 'id', title: 'name' }"
      @select="handleSelect"
      ref="basicTreeRef"
      class="scrollbar__wrap role-list"
    >
    </BasicTree>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, unref, nextTick } from 'vue';
  import {Spin} from "ant-design-vue";
  import { BasicTree, TreeActionType, TreeItem } from '/@/components/Tree';
  import {findNode} from "/@/utils/helper/treeHelper";
  import { getRoleList } from "/@/api/permission/role";
  import { useI18n } from '/@/hooks/web/useI18n';
  export default defineComponent({
    name: 'JobGradeList',
    components: { BasicTree, Spin },
    
    emits: ['select'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const treeData = ref<TreeItem[]>([]);
      const treeLoading = ref<boolean>(false);
      const basicTreeRef = ref<Nullable<TreeActionType>>(null);

      async function fetch() {
        treeLoading.value = true;
        getRoleList({status:1}).then(res => {
          console.log('res',res)
          treeData.value = (res as unknown) as TreeItem[];
          nextTick(() => {
            // 加载后展开节层级
            if(unref(treeData).length < 10){
              unref(basicTreeRef)?.filterByLevel(1);
            }
          });
        }).finally(()=>{
          treeLoading.value = false;
        });
      }

      function handleSelect(keys: string, e) {
        const node = findNode(treeData.value, (item)=>item.id===keys[0], {id: 'id', pid:'pid', children:'children'})
        emit('select', node);
      }

      onMounted(() => {
        fetch();
      });
      return { treeData, treeLoading, basicTreeRef, handleSelect,t,fetch };
    },
  });
</script>
<style scoped lang="less">
.role-list {
  /deep/ .ant-tree-switcher {
    width:10px;
  }
}
</style>
