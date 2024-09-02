import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
import { DeptLabelLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
export const columns: BasicColumn[] = [
  {
    title: t('views.dept.deptCode'),
    dataIndex: 'deptCode',
    align: 'left',
    width:100,
  },
  {
    title: t('views.dept.deptName'),
    dataIndex: 'deptName',
    align: 'left',
    customRender:({record}) => {
      let key = DeptLabelLocaleLang[getLocale.value]
      return record[key]
    }
  },
  // {
  //   title: t('views.dept.deptNameEn'),
  //   dataIndex: 'deptNameEn',
  //   align: 'left',
  // },
  // {
  //   title: t('views.dept.companyName'),
  //   dataIndex: 'companyName',
  //   align: 'left',
  // },
  {
    title: t('views.dept.deptHeadName'),
    dataIndex: 'deptHeadName',
    width: 200,
    align: 'left',
    customRender: ({ record }) => {
      return record.deptHeadId?`${record.deptHeadName||''}[${record.deptHeadCode}]`:'';
    },
  },
  {
    title: t('views.dept.phone'),
    dataIndex: 'phone',
    align: 'left',
    width:200,
  },
  {
    title: t('views.dept.email'),
    dataIndex: 'email',
    align: 'left',
    width:200,
  },
  {
    title: t('views.dept.sort'),
    dataIndex: 'sort',
    align: 'center',
    width: 80,
    // // resizable:false
  },
  {
    title: t('views.dept.createdAt'),
    dataIndex: 'createdAt',
    align: 'center',
    width: 180,
    // // resizable:false,
    defaultHidden:true
  },
  {
    title: t('views.dept.status'),
    dataIndex: 'status',
    align: 'center',
    width: 80,
    // // resizable:false
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'deptName',
    label: t('views.dept.deptName'),
    component: 'Input',
    itemProps:{
      labelAlign:'left'
    },
    colProps: {span: 8},
  },
  {
    field: 'deptCode',
    label: t('views.dept.deptCode'),
    component: 'Input',
    colProps: {span: 8},
  }
];

export const deptFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    required: false,
    component: 'Input',
    show: false,
  },
  {
    field: 'parentId',
    label: 'parentId',
    required: false,
    component: 'Input',
    show: false,
  },
  {
    field: 'deptCode',
    label: t('views.dept.deptCode'),
    component: 'Input',
    required: true,
    colProps: { span: 24 },
  },
  {
    field: 'deptName',
    label: t('views.dept.deptName'),
    component: 'Input',
    required: true,
    colProps: { span: 24 },
  },
  {
    field: 'deptNameEn',
    label: t('views.dept.deptNameEn'),
    component: 'Input',
    required: true,
    colProps: { span: 24 },
  },
  {
    field: 'deptHeadId',
    label: t('views.dept.deptHeadName'),
    component: 'Input',
    slot: 'settingLeader',
    required: false,
    colProps: { span: 24 },
  },
  {
    field: 'deptHeadName',
    label: 'deptHeadName',
    component: 'Input',
    show: false,
  },
  {
    field: 'deptHeadCode',
    label: 'deptHeadCode',
    component: 'Input',
    show: false,
  },
  {
    field: 'companyId',
    label: t('views.dept.companyName'),
    component: 'TreeSelect',
    componentProps: {
      treeNodeFilterProp: 'companyName',
      replaceFields: {
        title: 'companyName',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    required: true,
    colProps: { span: 24 },
  },
  {
    field: 'companyCode',
    label: 'companyCode',
    component: 'Input',
    show: false,
  },
  {
    field: 'phone',
    label: t('views.dept.phone'),
    required: false,
    component: 'Input',
  },
  {
    field: 'email',
    label: t('views.dept.email'),
    required: false,
    component: 'Input',
  },
  {
    field: 'sort',
    label: t('views.dept.sort'),
    required: false,
    component: 'InputNumber',
  },
  {
    field: 'status',
    label: t('views.dept.status'),
    required: false,
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: t('common.enable'), value: 1 },
        { label: t('common.disenabled'), value: 0 },
      ],
    },
    colProps: { span: 24 },
  },
];
