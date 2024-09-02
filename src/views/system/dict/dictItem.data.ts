import { Upload } from '/@/api/sys/file';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
import { DictItemLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
export const columns: BasicColumn[] = [
  {
    title: t('views.dictItem.id'),
    dataIndex: 'id',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
  {
    title: t('views.dictItem.dictId'),
    dataIndex: 'dictId',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
  {
    title: t('views.dictItem.dictCode'),
    dataIndex: 'dictCode',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
  {
    title: t('views.dictItem.itemValue'),
    dataIndex: 'itemValue',
    align: 'left',
    sorter: false
  },
  {
    title: t('views.dictItem.itemText'),
    dataIndex: 'itemText',
    align: 'left',
    sorter: false,
    customRender:({record}) => {
      let key = DictItemLocaleLang[getLocale.value]
      return record[key]
    }
  },
  // {
  //   title: t('views.dictItem.itemTextEn'),
  //   dataIndex: 'itemTextEn',
  //   width: 100,
  //   align: 'left',
  //   sorter: false
  // },
  {
    title: t('views.dictItem.sort'),
    dataIndex: 'sort',
    width: 120,
    align: 'center',
    sorter: false,
  },
  {
    title: t('views.dictItem.status'),
    dataIndex: 'status',
    width: 100,
    align: 'center',
    sorter: false,
  },
  {
    title: t('views.dictItem.itemRemark'),
    dataIndex: 'itemRemark',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
  {
    title: t('views.dictItem.itemRemarkEn'),
    dataIndex: 'itemRemarkEn',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
  {
    title: t('views.dictItem.itemStyle'),
    dataIndex: 'itemStyle',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
  {
    title: t('views.dictItem.itemCss'),
    dataIndex: 'itemCss',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
  {
    title: t('views.dictItem.createdBy'),
    dataIndex: 'createdBy',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
  {
    title: t('views.dictItem.createdAt'),
    dataIndex: 'createdAt',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
  {
    title: t('views.dictItem.updatedBy'),
    dataIndex: 'updatedBy',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
  {
    title: t('views.dictItem.updatedAt'),
    dataIndex: 'updatedAt',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'itemValue',
    label: t('views.dictItem.itemValue'),
    component: 'Input',
    colProps: {
      span: 8,
      lg: { span: 8, offset: 0 },
      sm: { span: 12, offset: 0 },
      xs: { span: 12, offset: 0 },
    },
    itemProps: {
      labelAlign: 'left',
    },
  },
  {
    field: 'itemText',
    label: t('views.dictItem.itemText'),
    component: 'Input',
    colProps: {
      span:8,
      lg: { span: 8, offset: 0 },
      sm: { span: 12, offset: 0 },
      xs: { span: 12, offset: 0 },
    },
  },
];
export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: t('views.dictItem.id'),
    defaultValue: '',
    show:false,
    required: false,
    component: 'Input',
    componentProps: {
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'dictId',
    label: t('views.dictItem.dictId'),
    defaultValue: '',
    required: true,
    show:false,
    component: 'Input',
    componentProps: {
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'dictCode',
    label: t('views.dictItem.dictCode'),
    defaultValue: '',
    required: true,
    component: 'Input',
    show:false,
    componentProps: {
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'itemValue',
    label: t('views.dictItem.itemValue'),
    defaultValue: '',
    required: true,
    component: 'Input',
    componentProps: {
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'itemText',
    label: t('views.dictItem.itemText'),
    defaultValue: '',
    required: true,
    component: 'Input',
    componentProps: {
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'itemTextEn',
    label: t('views.dictItem.itemTextEn'),
    defaultValue: '',
    required: true,
    component: 'Input',
    componentProps: {
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'itemRemark',
    label: t('views.dictItem.itemRemark'),
    defaultValue: '',
    required: false,
    component: 'InputTextArea',
    componentProps: {
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'itemRemarkEn',
    label: t('views.dictItem.itemRemarkEn'),
    defaultValue: '',
    required: false,
    component: 'InputTextArea',
    componentProps: {
    },
    colProps: {
      span: 24,
    },
  },
  // {
  //   field: 'itemCss',
  //   label: t('views.dictItem.itemCss'),
  //   defaultValue: '',
  //   required: false,
  //   component: 'Input',
  //   componentProps: {
  //   },
  //   colProps: {
  //     span: 24,
  //   },
  // },
  // {
  //   field: 'itemStyle',
  //   label: t('views.dictItem.itemStyle'),
  //   defaultValue: '',
  //   required: false,
  //   component: 'InputTextArea',
  //   componentProps: {
  //   },
  //   colProps: {
  //     span: 24,
  //   },
  // },
  {
    field: 'sort',
    label: t('views.dictItem.sort'),
    defaultValue: '',
    required: false,
    component: 'InputNumber',
    componentProps: {
    },
    colProps: {
      span: 34,
    },
  },
  {
    field: 'status',
    label: t('views.dict.status'),
    defaultValue: 1,
    required: false,
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        { label: t('common.enable'), value: 1 },
        { label: t('common.disenabled'), value: 0 },
      ],
    },
    colProps: {
      span: 24,
    },
  },
];