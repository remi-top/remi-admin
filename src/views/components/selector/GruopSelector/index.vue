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
          @check="onCheck"
        />
      </div>
          <!-- :replaceFields="{ key: 'id', title: getNameKey }" -->
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
                  {{ item[getNameKey] }}
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
  
  import { getGroupTree } from '/@/api/org/group';
  import { PageWrapper } from '/@/components/Page';
  import { Icon } from '/@/components/Icon';
  import OrgTree from '/@/views/components/leftTree/OrgTree.vue';
  import { Button, Tag } from 'ant-design-vue';
  import { cordTypeMap } from '/@/views/permission/role/modules/data';
  import { Card, List, ListItem } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { GroupLabelLocaleLang } from '/@/enums/appEnum'
  import { useLocale } from '/@/locales/useLocale';
  import { eachTree, findNode } from '/@/utils/helper/treeHelper'
  const { getLocale } = useLocale();
  export default defineComponent({
    props: {
      title: {
        type: String,
        default: '',
      },
    },
    name: 'GroupSelector',
    components: {
      BasicModal,
      BasicTree,
      Card,
      List,
      ListItem,
      PageWrapper,
      Icon,
      OrgTree,
      Tag,
      
    },
    setup(_, { emit }) {
      let selectedKeys = ref<string[]>([]);
      const treeData = ref<TreeItem[]>([]);
      const isCheckParentNodes = ref(false)
      const { t } = useI18n();
      const basicTreeRef = ref<Nullable<TreeActionType>>(null);
      const selectedList = ref([]);
      const [registerModal, { closeModal }] = useModalInner(async (data) => {
        // 加载已选中项
        isCheckParentNodes.value = data?.isCheckParentNodes
        selectedList.value = data?.selectedList.map(item => {
          return item
        }) || [];
        fetch()
        // reload();
      });

      const getTitle = computed(() => t('views.components.selectPosition'));
      const getNameKey = computed(() => GroupLabelLocaleLang[getLocale.value]);

      async function fetch() {
        getGroupTree({ status: 1 }).then((res) => {
          treeData.value = res as unknown as TreeItem[];
          nextTick(() => {
            selectedKeys.value = selectedList.value.map(item => {
              return item.id
            });
            // 加载后展开节层级
            if(unref(treeData).length < 10){
              unref(basicTreeRef)?.filterByLevel(1);
            }
          });
        });
      }

      function handleSubmit() {
        emit('success', selectedKeys.value, selectedList.value);
        closeModal();
      }
      function onCheck(checkedKeys, e) {
        if (e.checked) {
          selectedList.value = selectedList.value.concat([
            e.node
          ]);
          // 当子节点 选中时，自动勾选父节点
          unref(isCheckParentNodes) && checkParentNodes(checkedKeys.checked);
        } else {
          const index = selectedList.value.findIndex((item) => {
            return item.id == e.node?.id;
          });
          if (index > -1) {
            selectedList.value.splice(index, 1);
          }
        }
      }
      function checkParentNodes(checkedKeys: string[]) {
        const treeNodes = [];
        // 假设你有一个方法可以获取所有的树形节点
        eachTree(treeData.value,(node) => {
          treeNodes.push(node)
        })
        checkedKeys.forEach(checkedKey => {
          const parentKey = findParentKey(treeNodes, checkedKey);
          if (parentKey &&!checkedKeys.includes(parentKey)) {
            selectedKeys.value = [...checkedKeys, parentKey]
            selectedList.value = selectedList.value.concat([findNode(treeData.value, (item)=>item.key === parentKey, {id: 'id', pid:'parentId', children:'children'})]);
          }
        });
      };

      const findParentKey = (treeNodes: any[], key: string) => {
        for (let i = 0; i < treeNodes.length; i++) {
          const node = treeNodes[i];
          if (node.children) {
            if (node.children.some(child => child.key === key)) {
              return node.key;
            } else if (findParentKey(node.children, key)) {
              return findParentKey(node.children, key);
            }
          }
        }
        return null;
      };

      function deleteItem(item, index) {
        if (item) {
          selectedList.value.splice(index, 1);
          let list = selectedList.value.map((item) => {
            return item.id;
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
        registerModal,
        getTitle,
        getNameKey,
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
