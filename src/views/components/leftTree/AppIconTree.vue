<template>
  <div class="bg-white overflow-hidden app_wrap" v-loading="treeLoading">
    <BasicTree
      search
      :clickRowToExpand="false"
      :treeData="treeData"
      :replaceFields="{ key: 'id', title: 'companyName' }"
      @select="handleSelect"
      ref="basicTreeRef"
      class="scrollbar__wrap"
    >
    <template #title="node">
      <div class="flex items-center">
        <div class="mr-2 icon-logo" :style="{background:node.appIconColor}">
          <Icon :icon="node.appIcon" class="iconLogo" :size="28"/>
        </div>
        <div>
          {{ node.appName }}
        </div>
      </div>
      <!-- <template v-if="node.menuType == 3">({{ menuType[node.menuType]?.label }})</template> -->
      <!-- <a-tag :color="menuType[node.menuType]?.color" v-if="node.menuType != 1"></a-tag> -->
    </template>
    </BasicTree>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, unref, nextTick } from 'vue';
  import {Spin} from "ant-design-vue";
  import { BasicTree, TreeActionType, TreeItem } from '/@/components/Tree';
  import { getAppList } from '/@/api/application/app/app';
  import {findNode} from "/@/utils/helper/treeHelper";
  import { useI18n } from '/@/hooks/web/useI18n';
  export default defineComponent({
    name: 'CompanyTree',
    components: { BasicTree, Spin },
    
    emits: ['select'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const treeData = ref<TreeItem[]>([]);
      const treeLoading = ref<boolean>(false);
      const basicTreeRef = ref<Nullable<TreeActionType>>(null);

      async function fetch() {
        treeData.value = []
        treeLoading.value = true;
        getAppList().then(res => {
          if (res && res.length) {
            res.map(i => {
              if (i.appCode !== 'sso') {
                treeData.value.push(i)
              }
            })
          }
          // treeData.value = (res as unknown) as TreeItem[];
          // console.log(treeData.value,'treeData.value');
          
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
        const node = findNode(treeData.value, (item)=>item.id===keys[0], {id: 'id', pid:'parentId', children:'children'})
        emit('select', node);
      }

      onMounted(() => {
        fetch();
      });
      return { treeData, treeLoading, basicTreeRef, handleSelect,t };
    },
  });
</script>
<style lang="less" scoped>
.app_wrap {
  /deep/.ant-tree-switcher {
    width: 10px;
  }
  .icon-logo {
    font-size: 22px;
    color: rgb(255, 255, 255);
    padding: 5px;
    border-radius: 15%;
  }
}
</style>
