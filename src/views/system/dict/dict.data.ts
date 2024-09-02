import { Upload } from '/@/api/sys/file';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { DictLocaleLang, DictRemarkLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export const columns: BasicColumn[] = [
  {
    title: t('views.dict.dictCode'),
    dataIndex: 'dictCode',
    width: 120,
    align: 'left',
    sorter: false
  },
  {
    title: t('views.dict.dictName'),
    dataIndex: 'dictName',
    align: 'left',
    sorter: false,
    customRender:({record}) => {
      let key = DictLocaleLang[getLocale.value]
      return record[key]
    }
  },
  // {
  //   title: t('views.dict.dictNameEn'),
  //   dataIndex: 'dictNameEn',
  //   width: 100,
  //   align: 'left',
  //   sorter: false
  // },
  {
    title: t('views.dict.dictRemark'),
    dataIndex: 'dictRemark',
    align: 'left',
    sorter: false,
    customRender:({record}) => {
      let key = DictRemarkLocaleLang[getLocale.value]
      return record[key]
    }
    // defaultHidden:true
  },
  // {
  //   title: t('views.dict.dictRemarkEn'),
  //   dataIndex: 'dictRemarkEn',
  //   width: 100,
  //   align: 'left',
  //   sorter: false,
  //   defaultHidden:true
  // },
  {
    title: t('views.dict.status'),
    dataIndex: 'status',
    width: 100,
    align: 'center',
    sorter: false
  },
  {
    title: t('views.dict.createdBy'),
    dataIndex: 'createdBy',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
  {
    title: t('views.dict.createdAt'),
    dataIndex: 'createdAt',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
  {
    title: t('views.dict.updatedBy'),
    dataIndex: 'updatedBy',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
  {
    title: t('views.dict.updatedAt'),
    dataIndex: 'updatedAt',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'dictName',
    label: t('views.dict.dictName'),
    component: 'Input',
    labelWidth:80,
    itemProps:{
      labelAlign:'left',
    },
    colProps: {
      span: 8,
      lg: { span: 8, offset: 0 },
      sm: { span: 12, offset: 0 },
      xs: { span: 12, offset: 0 },
    },
  },
  {
    field: 'dictCode',
    label: t('views.dict.dictCode'),
    component: 'Input',
    labelWidth:80,
    colProps: {
      span: 8,
      lg: { span: 8, offset: 0 },
      sm: { span: 12, offset: 0 },
      xs: { span: 12, offset: 0 },
    },
  }
];
export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'id',
    component:'Input',
    show:false
  },
  {
    field: 'dictCode',
    label: t('views.dict.dictCode'),
    defaultValue: '',
    required: true,
    component: 'Input',
    componentProps: {
    }
  },
  {
    field: 'dictName',
    label: t('views.dict.dictName'),
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
    field: 'dictNameEn',
    label: t('views.dict.dictNameEn'),
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
    field: 'dictRemark',
    label: t('views.dict.dictRemark'),
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
    field: 'dictRemarkEn',
    label: t('views.dict.dictRemarkEn'),
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
    }
  },
];