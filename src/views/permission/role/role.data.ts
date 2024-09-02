import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Form';
import { h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { Tag } from 'ant-design-vue'
const { t } = useI18n();
import { RoleNameLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
export const roleTypeMap = {
  1:{
    label:t('views.role.roleTypeMap1'),
    value:1,
    color:'blue'
  },
  2:{
    label:t('views.role.roleTypeMap2'),
    value:2,
    color:'purple'
  },
  3:{
    label:t('views.role.roleTypeMap3'),
    value:3,
    color:'green'
  },
  4:{
    label:t('views.role.roleTypeMap4'),
    value:4,
    color:'orange'
  },

}
export const columns: BasicColumn[] = [
  {
    title: t('views.role.roleCode'),
    dataIndex: 'roleCode',
    align:'left'
  },
  {
    title: t('views.role.roleName'),
    dataIndex: 'roleName',
    align:'left',
    customRender:({record}) => {
      let key = RoleNameLocaleLang[getLocale.value]
      return record[key]
    }
  },
  // {
  //   title: t('views.role.roleNameEn'),
  //   dataIndex: 'roleNameEn',
  // },  
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
  {
    title: t('views.role.roleRemark'),
    dataIndex: 'roleRemark',
    defaultHidden:true,
  },
  {
    title: t('views.role.roleRemarkEn'),
    dataIndex: 'roleRemarkEn',
    defaultHidden:true,
  },
  {
    title: t('views.role.sort'),
    dataIndex: 'sort',
    align: 'center',
    width: 50,
    defaultHidden:true,
  },
  {
    title: t('views.role.status'),
    dataIndex: 'status',
    align: 'center',
    width: 80,
    defaultHidden:true
  },
  {
    title: t('views.role.createdAt'),
    dataIndex: 'createdAt',
    width: 180,
    defaultHidden:true,
    // resizable:false
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
  // {
  //   field: 'roleType',
  //   label: t('views.role.roleType'),
  //   component: 'Select',
  //   componentProps:{
  //     options:Object.values(roleTypeMap)
  //   },
    // colProps: {
    //   span: 8,
    //   lg: { span: 8, offset: 0 },
    //   sm: { span: 12, offset: 0 },
    //   xs: { span: 12, offset: 0 },
    // },
  // },
];

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'roleCode',
    label: t('views.role.roleCode'),
    required: true,
    component: 'Input',
  },
  {
    field: 'roleName',
    label: t('views.role.roleName'),
    required: true,
    component: 'Input',
  },
  {
    field: 'roleNameEn',
    label: t('views.role.roleNameEn'),
    required: true,
    component: 'Input',
  },
  {
    field: 'roleType',
    label: t('views.role.roleType'),
    required: true,
    defaultValue:1,
    component: 'Select',
    componentProps:{
      options:Object.values(roleTypeMap)
    }
  },
  {
    label: t('views.role.roleRemark'),
    field: 'roleRemark',
    component: 'InputTextArea',
  },
  {
    label: t('views.role.roleRemarkEn'),
    field: 'roleRemarkEn',
    component: 'InputTextArea',
  },
  {
    field: 'sort',
    label: t('views.role.sort'),
    required: false,
    component: 'InputNumber',
  },
  {
    field: 'status',
    label: t('views.role.status'),
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: t('common.enable'), value: 1 },
        { label: t('common.disenabled'), value: 0 },
      ],
    },
  },
  // {
  //   label: ' ',
  //   field: 'menu',
  //   slot: 'menu',
  //   component: 'Input',
  // },
];
export const setAclFormSchema: FormSchema[] = [
  {
    field: 'roleId',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'authMenus',
    label: 'ID',
    required: true,
    component: 'Input',
    show: false,
  },
]

export const formMenuSchema: FormSchema[] = [
  {
    field: 'roleId',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'menu',
    label: ' ',
    slot: 'authMenus',
    component: 'Input',
  },
]