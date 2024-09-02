import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { roleTypeMap } from '../role/role.data'
const { t } = useI18n();
export const columns: BasicColumn[] = [
  {
    title: t('views.role.roleCode'),
    dataIndex: 'roleCode',
    align:'left'
  },
  {
    title: t('views.role.roleName'),
    dataIndex: 'roleName',
    align:'left'
  },
  {
    title: t('views.role.roleType'),
    dataIndex: 'roleType',
    customRender:({record}) => {
      let value = record.roleType
      let color = roleTypeMap[value]?.color
      let text = roleTypeMap[value]?.label
      return h(Tag,{color},text)
    },
    resizable:false,
    width:150
  }, 
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'roleCode',
    label: t('views.role.roleCode'),
    component: 'Input',
    itemProps:{
      labelAlign:'left'
    },
    colProps: {
      span: 8,
      lg: { span: 8, offset: 0 },
      sm: { span: 12, offset: 0 },
      xs: { span: 12, offset: 0 },
    },
  },
  {
    field: 'roleName',
    label: t('views.role.roleName'),
    component: 'Input',
    colProps: {
      span: 8,
      lg: { span: 8, offset: 0 },
      sm: { span: 12, offset: 0 },
      xs: { span: 12, offset: 0 },
    },
  },
];
export const formMenuSchema: FormSchema[] = [
  {
    field: 'roleId',
    label: 'roleId',
    component: 'Input',
    show: false,
  },
  {
    field: 'roleCode',
    label: 'roleCode',
    component: 'Input',
    show: false,
  },
  {
    field: 'menu',
    label: '',
    slot: 'authMenus',
    component: 'Input',
  },
]