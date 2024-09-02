import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { RankLabelLocaleLang, RankRemarkLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
const { t } = useI18n();
export const columns: BasicColumn[] = [
  {
    title: t('views.jobRank.rankCode'),
    dataIndex: 'rankCode',
    align: 'left',
  },
  {
    title: t('views.jobRank.rankName'),
    dataIndex: 'rankName',
    align: 'left',
    customRender:({record}) => {
      let key = RankLabelLocaleLang[getLocale.value]
      return record[key]
    }
  },
  // {
  //   title: t('views.jobRank.rankNameEn'),
  //   dataIndex: 'rankNameEn',
  //   align: 'left',
  // },
  {
    title: t('views.jobRank.rankRemark'),
    dataIndex: 'rankRemark',
    align: 'left',
    customRender:({record}) => {
      let key = RankRemarkLocaleLang[getLocale.value]
      return record[key]
    }
  },
  // {
  //   title: t('views.jobRank.rankRemarkEn'),
  //   dataIndex: 'rankRemarkEn',
  //   align: 'left',
  // },
  {
    title: t('views.jobRank.sort'),
    dataIndex: 'sort',
    width: 160,
    align: 'center',
    defaultHidden:true
    // // resizable:false
  },
  {
    title: t('views.jobRank.status'),
    dataIndex: 'status',
    align: 'center',
    width: 80,
    resizable:false,
    defaultHidden:true
  },
  // {
  //   title: t('views.dept.createdAt'),
  //   dataIndex: 'createdAt',
  //   align: 'center',
  //   width: 180,
  // },
  /*{
    title: '创建人',
    dataIndex: 'creator',
    width: 100,
    align: 'left',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 100,
    align: 'left',
  },
  {
    title: '修改人',
    dataIndex: 'updator',
    width: 100,
    align: 'left',
  },
  {
    title: '修改时间',
    dataIndex: 'updateTime',
    width: 100,
    align: 'left',
  }*/
];

export const searchFormSchema: FormSchema[] = [
  // {
  //   field: 'titleCode',
  //   label: '职级编码',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: '请输入编码',
  //   },
  //   labelWidth: 100,
  //   colProps: {span: 6, lg:{span: 6, offset:0}, sm:{span: 10, offset: 0}, xs:{span: 16, offset: 0}},
  // },
  {
    field: 'rankName',
    label: t('views.jobRank.rankName'),
    component: 'Input',
    labelWidth: 100,
    colProps: {span: 6, lg:{span: 6, offset:0}, sm:{span: 10, offset: 0}, xs:{span: 16, offset: 0}},
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
    field: 'rankCode',
    label: t('views.jobRank.rankCode'),
    required: true,
    component: 'Input',
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'rankName',
    label: t('views.jobRank.rankName'),
    required: true,
    component: 'Input',
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'rankNameEn',
    label: t('views.jobRank.rankNameEn'),
    required: true,
    component: 'Input',
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'positionId',
    label: t('views.position.positionName'),
    required: true,
    component: 'Select',
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'positionCode',
    label:'positionCode',
    component: 'Input',
    show: false,
    colProps: { span: 24 },
  },
  {
    field: 'rankRemark',
    label: t('views.jobRank.rankRemark'),
    required: false,
    component: 'Input',
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'rankRemarkEn',
    label: t('views.jobRank.rankRemarkEn'),
    required: false,
    component: 'Input',
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'sort',
    label: t('views.jobRank.sort'),
    required: false,
    component: 'InputNumber',
    show: true,
  },
  {
    field: 'status',
    label: t('views.jobRank.status'),
    required: false,
    show:false,
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
