import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
import { CompanyLabelLocaleLang, CompanyAddressLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
export const columns: BasicColumn[] = [
  {
    title: t('views.company.companyCode'),
    dataIndex: 'companyCode',
    width:150,
    align: 'left',
  },
  {
    title: t('views.company.companyName'),
    dataIndex: 'companyName',
    align: 'left',
    customRender:({record}) => {
      let key = CompanyLabelLocaleLang[getLocale.value]
      return record[key]
    }
  },
  // {
  //   title: t('views.company.companyNameEn'),
  //   dataIndex: 'companyNameEn',
  //   align: 'left',
  // },
  {
    title: t('views.company.companyAddress'),
    dataIndex: 'companyAddress',
    align: 'left',
    customRender:({record}) => {
      let key = CompanyAddressLocaleLang[getLocale.value]
      return record[key]
    }
  },
  // {
  //   title: t('views.company.companyAddressEn'),
  //   dataIndex: 'companyAddressEn',
  //   align: 'left',
  // },
  {
    title: t('views.company.companyRemark'),
    dataIndex: 'companyRemark',
    align: 'left',
    defaultHidden:true
  },
  {
    title: t('views.company.companyRemarkEn'),
    dataIndex: 'companyRemarkEn',
    align: 'left',
    defaultHidden:true
  },
  {
    title: t('views.company.status'),
    dataIndex: 'status',
    align: 'center',
    width: 80,
    // // resizable:false
  },
  {
    title: t('views.company.sort'),
    dataIndex: 'sort',
    align: 'center',
    width: 80,
    // // resizable:false
  },
  {
    title: t('views.company.createdAt'),
    dataIndex: 'createdAt',
    width: 180,
    // // resizable:false
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'companyName',
    label: t('views.company.companyName'),
    component: 'Input',
    itemProps:{
      labelAlign:'left'
    },
    // labelWidth: 80,
    colProps: {span: 8},
  },
  {
    field: 'companyCode',
    label: t('views.company.companyCode'),
    component: 'Input',
    // labelWidth: 80,
    colProps: {span: 8},
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
    defaultValue:'123'
  },
  {
    field: 'parentId',
    label: 'parentId',
    required: false,
    component: 'Input',
    show: false,
  },
  {
    field: 'companyCode',
    label: t('views.company.companyCode'),
    required: true,
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    field: 'companyName',
    label: t('views.company.companyName'),
    required: true,
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    field: 'companyNameEn',
    label: t('views.company.companyNameEn'),
    required: true,
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    field: 'companyAddress',
    label: t('views.company.companyAddress'),
    required: false,
    component: 'InputTextArea',
  },
  {
    field: 'companyAddressEn',
    label: t('views.company.companyAddressEn'),
    required: false,
    component: 'InputTextArea',
  },
  {
    field: 'companyRemark',
    label: t('views.company.companyRemark'),
    required: false,
    component: 'InputTextArea',
  },
  {
    field: 'companyRemarkEn',
    label: t('views.company.companyRemarkEn'),
    required: false,
    component: 'InputTextArea',
  },
  {
    field: 'sort',
    label: t('views.company.sort'),
    required: false,
    component: 'InputNumber',
  },
  {
    field: 'status',
    label: t('views.company.status'),
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
