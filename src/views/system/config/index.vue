<template>
  <PageWrapper fixedHeight contentClass="bg-white">
    <BasicTable @register="registerTable" class="flex-1" style="height:auto">
      <template #tableTitle>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref,computed } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { Icon } from "/@/components/Icon";
  import { PerEnum } from "/@/enums/perEnum";
  import { Authority } from "/@/components/Authority";
  import { usePermission } from '/@/hooks/web/usePermission';
  import { Switch } from 'ant-design-vue'
  
  import { Button } from '/@/components/Button'
  import { useRoute } from 'vue-router'
  import { getConfigRecordPage } from '/@/api/system/config/index';
  import { PageWrapper } from '/@/components/Page';
  import { columns, searchFormSchema } from './config.data';
  import { useI18n } from '/@/hooks/web/useI18n';
export default defineComponent({
  name: 'SysConfig',
  components: { BasicTable, TableAction,Icon,Button,Switch,Authority,PageWrapper },
  setup() {
      const { t } = useI18n();
      let disabled = ref(<boolean>true)
      const { getPermissionInfo } = usePermission();
      const route = useRoute()
      const [registerTable] = useTable({
        api: getConfigRecordPage,
        columns:columns,
        formConfig: {
          labelWidth: 90,
          schemas: searchFormSchema,
          showAdvancedButton: true,
          showResetButton: true,
          autoSubmitOnEnter: true,
        },
        // rowSelection: {
        //   type: 'checkbox',
        //   columnWidth: 30,
        //   onChange:rowSelectionChange
        // },
        showTableSetting: false,
        canColDrag: true,
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        clickToRowSelect:false,
        // actionColumn: {
        //   title: t('common.operating'),
        //   dataIndex: 'action',
        //   fixed: 'right',
        //   slots: { customRender: 'action' }
        // },
      });

      return {
        disabled,
        route,
        getPermissionInfo,
        PerEnum,
        registerTable,
        t
      };
    },
  });
</script>
<style lang="less" scoped>
.content-btn {
  color: @primary-color;
  cursor: pointer;
  text-decoration: underline;
}
</style>
