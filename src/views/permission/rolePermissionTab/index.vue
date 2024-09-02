<template>
  <PageWrapper fixedHeight contentClass="flex relative">
    <BasicTable @register="registerTable" class="w-1/2 table-custom-click-active-conent" style="height:auto"> </BasicTable>
    <div class="splitpanes__splitter"></div>
    <div class="flex-1 w-1/2 menu-tree bg-white">
      <div class="pl-2">
        <a-checkbox v-model:checked="expandAll" @change="(e) => treeChange(e,'expandAll')">{{
          t('component.tree.expandAll') + '/' + t('component.tree.unExpandAll')
        }}</a-checkbox>
        <a-checkbox v-model:checked="selectAll" @change="(e) => treeChange(e,'selectAll')">{{
          t('component.tree.selectAll') + '/' + t('component.tree.unSelectAll')
        }}</a-checkbox>
        <a-checkbox v-model:checked="checkStrictly" @change="(e) => treeChange(e,'checkStrictly')">{{
          t('component.tree.checkStrictly')
        }}</a-checkbox>
        <Authority :value="route.name+':'+PerEnum.AUTH" >
          <a-button type="primary" class="ml-2" @click="handleSubmit" v-loading="loading">{{ t('common.saveText') }}</a-button>
        </Authority>
      </div>
      <div>
        <BasicForm @register="registerForm">
          <template #authMenus="{ model, field }">
            <BasicTree
              v-model:value="selectValue"
              :treeData="treeData"
              :fieldNames="{ title: `${MenuLocaleLang[getLocale]}`, key: 'id' }"
              checkable
              ref="treeDataRef"
              class="menu-tree h-auto"
              :checkStrictly="!checkStrictly"
              @check="getCheckedKeys"
            >
            <template #title="node">
              {{node[MenuLocaleLang[getLocale]]}}
              <!-- <a-tag :color="menuType[node.menuType]?.color" v-if="node.menuType == 3">{{menuType[node.menuType]?.label}}</a-tag> -->
            </template>
            </BasicTree>
          </template>
        </BasicForm>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, unref,nextTick } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  // import RoleList from '/@/views/components/leftTree/RoleList.vue'
  
  import { getModulesList } from '/@/api/permission/module';
  import { ModuleInfo } from '/@/api/permission/model/moduleModel';
  import { getModuleAclsByGroupId, authMenu } from '/@/api/permission/permission';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { formMenuSchema, columns, searchFormSchema } from './Permission.data';
  import { getRoleListByPage } from '/@/api/org/role';
  import { menuType } from '/@/views/permission/menu/module.data'
  import { Icon } from '/@/components/Icon';
  import { PerEnum } from '/@/enums/perEnum';
  import { Authority } from '/@/components/Authority';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { Button } from '/@/components/Button'
  import { useRoute } from 'vue-router';
  import { cloneDeep,filter } from 'lodash-es';
  import { eachTree, findNode } from '/@/utils/helper/treeHelper';
  import { useLocale } from '/@/locales/useLocale';
  const { getLocale } = useLocale();
  import { MenuLocaleLang } from '/@/enums/appEnum';
  import { Switch } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  export default defineComponent({
    name: 'Module',
    components: {
      Switch,
      PageWrapper,
      // RoleList,
      Button,
      Authority,
      BasicTable,
      BasicForm,
      BasicTree,
      Icon,
      
    },
    setup() {
      const { t } = useI18n();
      let selectIndex = ref('');
      const checkAllData = ref([]);
      const selectValue = ref([])
      const loading = ref(false)
      const appListId = ref([])
      const treeDataRef = ref<HTMLElement>()
      const { getPermissionInfo } = usePermission();
      const route = useRoute();
      const treeData = ref<ModuleInfo[]>([]);
      const expandAll = ref(false);
      const selectAll = ref(false);
      const checkStrictly = ref(false);
      const [registerTable, { reload }] = useTable({
        api: getRoleListByPage,
        columns,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          showAdvancedButton: false,
          showResetButton: true,
          autoSubmitOnEnter: true,
          baseColProps:{
            span:8
          }
        },
        rowClassName: rowClassNameFn,
        customRow: handleClickRow,
        showTableSetting: false,
        canColDrag: true,
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
      });
      const [registerForm, { setFieldsValue, getFieldsValue, appendSchemaByField, validate }] =
        useForm({
          labelWidth: 1,
          showAdvancedButton: false,
          showResetButton: false,
          showSubmitButton:false,
          autoSubmitOnEnter: false,
          schemas: formMenuSchema,
        });
      async function getModule() {
        let res = await getModulesList();
        treeData.value = res;
        appListId.value = []
        treeData.value.map(item => {
          appListId.value.push(item.id)
        })
        nextTick(() => {
          // 加载后展开节层级
          unref(treeDataRef)?.filterByLevel(1);
        });
      }
      async function getRoleAuth(record) {
        try {
          loading.value = true
          const authData = await getModuleAclsByGroupId({roleId:record.id});
          const elementList: string[] = []
          selectValue.value = []
          // // 将已经授权的菜单填入
          authData.map((item) => {
            elementList.push(item.menuId);
            selectValue.value.push(item.menuId);
          });
          // console.log('.elementList',elementList)
          // 此处需要处理一下 ，回显时却只需要tree节点最深层的子id
          checkAllData.value = elementList
          // const childrenIdList: string[] = []
          // eachTree(treeData.value, (menu) => {
          //   // console.log(menu.menuName);
          //   if (!menu.children || !menu.children.length) {
          //     childrenIdList.push(menu.id);
          //   }
          // });
          // const result = [...new Set(childrenIdList)].filter((item) =>
          //   new Set(eval(elementList)).has(item),
          // );
          // // console.log('result',result)
          // selectValue.value = result
          // unref(treeDataRef)?.setSelectedKeys(checkList)
          await setFieldsValue({
            roleId: record.id,
            roleCode: record.roleCode,
          });
          loading.value = false
        } catch (error) {
          loading.value = false
        }
      }

      async function handleSubmit() {
        if(!getFieldsValue().roleId){
          return
        }
        let checkList = checkAllData.value
        const submitList = filter(checkList,function(i){
          return !unref(appListId).includes(i)
        })
        // console.log('submitList',submitList)
        // return
        let { roleId,roleCode } = await validate();
        const authMenus = submitList.map(item => {
          const node = findNode(unref(treeData), (i)=>i.id === item, {id: 'id', pid:'parentId', children:'children'})
          return {
            menuId:item,
            menuCode:node?.menuCode,
            roleId,
            roleCode,
            status: 1,
          }
        })
        console.log('authMenus',authMenus)
        // return
        try {
          loading.value = true
          await authMenu(authMenus);
          loading.value = false
          createMessage.success(t('views.role.authSuccessTitle'));
        } catch (error) {
          loading.value = false
        }
      }
      function getCheckedKeys(rawVal, e) {
        console.log(rawVal,e.halfCheckedKeys)
        checkAllData.value = e.halfCheckedKeys ? rawVal.concat(e.halfCheckedKeys) : rawVal.checked
      }
      function handleClickRow(record, index) {
        return {
          onClick: (e) => {
            getRoleAuth(record);
            selectIndex.value = index
            // 获取角色类型 展示对应的授权
          },
        };
      }
      function rowClassNameFn(record, index) {
        return index === selectIndex.value ? 'click-active' : '';
      }

      onMounted(async () => {
        getModule();
      });

      function treeChange(e,type){
        const checked = e.target.checked
        switch (type) {
          case 'expandAll':
            // treeRefList.value.map(item => {
            //   // console.log('item',item)
            //   item?.expandAll(checked)
            // })
            unref(treeDataRef)?.expandAll(checked)
            break;
          case 'selectAll':
            // treeRefList.value.map(item => {
            //   // console.log('item',item)
            //   item?.checkAll(checked)
            // })
            unref(treeDataRef)?.checkAll(checked)
            break;
          case 'checkStrictly':
            
            break;
        
          default:
            break;
        }
      }
      return {
        getCheckedKeys,
        selectValue,
        menuType,
        treeChange,
        expandAll,
        selectAll,
        checkStrictly,
        rowClassNameFn,
        handleClickRow,
        registerTable,
        registerForm,
        route,
        treeData,
        getPermissionInfo,
        PerEnum,
        MenuLocaleLang,
        getLocale: getLocale.value,
        t,
        loading,
        treeDataRef,
        handleSubmit
      };
    },
  });
</script>
<style lang="less" scoped>
  .menu-tree {
    border-bottom: 1px solid #eee;
    .tree-title  {
      padding-left:10px;
      margin-bottom: 10px;
      &::before {
        content: "";
        width: 4px;
        height: 22px;
        position: absolute;
        left: 0;
        background-color: @primary-color;
        border-radius: 0 4px 4px 0;
      }
    }
    /deep/ .ant-tree-list-holder-inner {
      display: inline-block !important;
    }
    /deep/ .line_leaf {
      display: inline-flex !important;
      width: 200px;
      .vben-tree__title {
        color: @primary-color;
        padding: 2px 5px;
        border:1px solid @primary-color;
      }
      .ant-tree-indent {
        width:70px;
      }
      .ant-tree-title  {
        width: auto;
        justify-content: flex-start;
      }
      // .ant-tree-switcher-noop {
      //   display: none;
      // }
    }
  }
  .menu-tree {
    padding-top: 20px;
    /deep/ .vben-tree-header {
      padding:0 !important;
    }
    .icon-logo {
      font-size: 22px;
      color: rgb(255, 255, 255);
      padding: 5px;
      border-radius: 15%;
    }
  }
</style>
