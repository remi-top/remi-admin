<template>
  <div class="bg-white overflow-hidden job_grade-wrap" v-loading="treeLoading">
    <slot name="customTool"></slot>
    <BasicTree
      :search="search"
      :title="$props.title"
      :clickRowToExpand="false"
      :showIcon="false"
      :treeData="treeData"
      v-model:checkedKeys="checkedKeys"
      :checkable="checkable"
      :replaceFields="{ key: 'id', title: 'name' }"
      @select="handleSelect"
      ref="basicTreeRef"
      class="scrollbar__wrap job_grade"
    >
    </BasicTree>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, unref, nextTick } from 'vue';
  import {Spin} from "ant-design-vue";
  import { BasicTree, TreeActionType, TreeItem } from '/@/components/Tree';
  import {findNode} from "/@/utils/helper/treeHelper";
  import { getGroupList } from "/@/api/org/group";
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  export default defineComponent({
    name: 'JobGradeList',
    components: { BasicTree, Spin },
    props:{
      checkable:{
        type:Boolean,
        default:false
      },
      search:{
        type:Boolean,
        default:true
      },
      title:{
        type:String,
        default:t('views.components.gradeCategory')
      }
    },
    emits: ['select'],
    setup(props, { emit }) {
      const checkable = ref(false)
      const search = ref(true)
      checkable.value = props.checkable
      search.value = props.search
      const treeData = ref<TreeItem[]>([]);
      const checkedKeys = ref<string[]>([]);
      const treeLoading = ref<boolean>(false);
      const basicTreeRef = ref<Nullable<TreeActionType>>(null);

      async function fetch() {
        treeLoading.value = true;
        getGroupList({status:1}).then(res => {
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
      return { treeData, treeLoading, basicTreeRef,t, handleSelect,t,fetch,checkedKeys,checkable,search };
    },
  });
</script>
<style lang="less" scoped>
.job_grade {
  /deep/.ant-tree-switcher {
    width: 10px;
  }
}
</style>
