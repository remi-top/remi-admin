import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
import { GroupLabelLocaleLang, GroupRemarkLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
export const columns: BasicColumn[] = [
  {
    title: t('views.groupInfo.groupCode'),
    dataIndex: 'groupCode',
    align: 'left',
  },
  {
    title: t('views.groupInfo.groupName'),
    dataIndex: 'groupName',
    align: 'left',
    customRender:({record}) => {
      let key = GroupLabelLocaleLang[getLocale.value]
      return record[key]
    }
  },
  // {
  //   title: t('views.groupInfo.groupNameEn'),
  //   dataIndex: 'groupNameEn',
  //   align: 'left',
  // },
  {
    title: t('views.groupInfo.groupRemark'),
    dataIndex: 'groupRemark',
    align: 'left',
    customRender:({record}) => {
      let key = GroupRemarkLocaleLang[getLocale.value]
      return record[key]
    }
  },
  // {
  //   title: t('views.groupInfo.groupRemarkEn'),
  //   dataIndex: 'groupRemarkEn',
  //   align: 'left',
  // },
  {
    title: t('views.groupInfo.sort'),
    dataIndex: 'sort',
    align: 'center',
    width:80,
    defaultHidden:true
    // resizable:false
  },
  {
    title: t('views.groupInfo.status'),
    dataIndex: 'status',
    align: 'center',
    width: 80,
    defaultHidden:true
    // resizable:false
  }
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'groupCode',
    label: t('views.groupInfo.groupCode'),
    component: 'Input',
    labelWidth: 80,
    itemProps:{
      labelAlign:'left'
    },
    colProps: {span: 8, lg:{span: 8, offset:0}, sm:{span: 10, offset: 0}, xs:{span: 16, offset: 0}},
  },
  {
    field: 'groupName',
    label: t('views.groupInfo.groupName'),
    component: 'Input',
    labelWidth: 80,
    colProps: {span: 8, lg:{span: 8, offset:0}, sm:{span: 10, offset: 0}, xs:{span: 16, offset: 0}},
  },
];

export const formSchema: FormSchema[] = [
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
    field: 'groupCode',
    label: t('views.groupInfo.groupCode'),
    required: true,
    component: 'Input',
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'groupName',
    label: t('views.groupInfo.groupName'),
    required: true,
    component: 'Input',
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'groupNameEn',
    label: t('views.groupInfo.groupNameEn'),
    required: true,
    component: 'Input',
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'groupRemark',
    label: t('views.groupInfo.groupRemark'),
    required: false,
    component: 'InputTextArea',
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'groupRemarkEn',
    label: t('views.groupInfo.groupRemarkEn'),
    required: false,
    component: 'InputTextArea',
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'sort',
    label: t('views.groupInfo.sort'),
    required: false,
    component: 'InputNumber',
    show: true,
  },
  {
    field: 'status',
    label: t('views.groupInfo.status'),
    required: false,
    component: 'Switch',
    defaultValue: 1,
    componentProps:{
      checkedChildren: t('common.enable'),
      unCheckedChildren: t('common.disenabled'),
      checkedValue: 1,
      unCheckedValue: 0,
    },
    colProps: { span: 24 },
  },
];
