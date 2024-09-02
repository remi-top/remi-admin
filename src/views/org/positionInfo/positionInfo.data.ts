import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { getJobGradeList } from "/@/api/org/jobGrade";
const { t } = useI18n();
import { PositionLabelLocaleLang, PositionRemarkLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
export const columns: BasicColumn[] = [
  {
    title: t('views.position.positionCode'),
    dataIndex: 'positionCode',
    align: 'left',
  },
  {
    title: t('views.position.positionName'),
    dataIndex: 'positionName',
    align: 'left',
    customRender:({record}) => {
      let key = PositionLabelLocaleLang[getLocale.value]
      return record[key]
    }
  },
  // {
  //   title: t('views.position.positionNameEn'),
  //   dataIndex: 'positionNameEn',
  //   align: 'left',
  // },
  // {
  //   title: t('views.jobGrade.gradeName'),
  //   dataIndex: 'positionGrade',
  //   align: 'left',
  // },
  {
    title: t('views.position.positionRemark'),
    dataIndex: 'positionRemark',
    align: 'left',
    customRender:({record}) => {
      let key = PositionRemarkLocaleLang[getLocale.value]
      return record[key]
    },
  },
  // {
  //   title: t('views.position.positionRemarkEn'),
  //   dataIndex: 'positionRemarkEn',
  //   align: 'left',
  //   defaultHidden:true
  // },
  {
    title: t('views.position.sort'),
    dataIndex: 'sort',
    align: 'center',
    width:80,
    defaultHidden: true
    // // resizable:false
  },
  {
    title: t('views.position.status'),
    dataIndex: 'status',
    align: 'center',
    width: 80,
    resizable:false,
    defaultHidden:true
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'positionCode',
    label: t('views.position.positionCode'),
    component: 'Input',
    labelWidth:80,
    itemProps:{
      labelAlign:'left'
    },
    colProps: {span: 8, lg:{span: 8, offset:0}, sm:{span: 14, offset: 0}, xs:{span: 16, offset: 0}},
  },
  {
    field: 'positionName',
    labelWidth:80,
    label: t('views.position.positionName'),
    component: 'Input',
    colProps: {span: 8, lg:{span: 8, offset:0}, sm:{span: 14, offset: 0}, xs:{span: 16, offset: 0}},
  }
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
    field: 'positionCode',
    label: t('views.position.positionCode'),
    required: true,
    component: 'Input',
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'positionName',
    label: t('views.position.positionName'),
    required: true,
    component: 'Input',
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'positionNameEn',
    label: t('views.position.positionNameEn'),
    required: true,
    component: 'Input',
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'gradeId',
    label: t('views.jobGrade.gradeName'),
    required: false,
    component: 'ApiSelect',
    componentProps:{
      api:getJobGradeList,
      params:{
        status:1
      },
      fieldNames: {
        label:'gradeName',
        value:'id'
      }
    },
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'gradeCode',
    label: 'gradeCode',
    required: false,
    component: 'Input',
    show: false,
    colProps: { span: 24 },
  },
  {
    field: 'positionRemark',
    label: t('views.position.positionRemark'),
    required: false,
    component: 'InputTextArea',
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'positionRemarkEn',
    label: t('views.position.positionRemarkEn'),
    required: false,
    component: 'InputTextArea',
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'sort',
    label: t('views.position.sort'),
    required: false,
    component: 'InputNumber',
    show: true,
  },
  {
    field: 'status',
    label: t('views.position.status'),
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
