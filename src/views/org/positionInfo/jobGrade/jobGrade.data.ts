import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { getJobGradeTypes } from '/@/api/org/jobGradeType';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
import { GradeLabelLocaleLang, GradeRemarkLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
export const columns: BasicColumn[] = [
  {
    title: t('views.jobGrade.gradeCode'),
    dataIndex: 'gradeCode',
    align: 'left',
  },
  {
    title: t('views.jobGrade.gradeName'),
    dataIndex: 'gradeName',
    align: 'left',
    customRender:({record}) => {
      let key = GradeLabelLocaleLang[getLocale.value]
      return record[key]
    }
  },
  {
    title: t('views.jobGrade.gradeRemark'),
    dataIndex: 'gradeRemark',
    align: 'left',
    customRender:({record}) => {
      let key = GradeRemarkLocaleLang[getLocale.value]
      return record[key]
    },
    resizable:false
  },
  {
    title: t('views.jobGrade.sort'),
    dataIndex: 'sort',
    width: 100,
    align: 'center',
    defaultHidden:true
    // // resizable:false
  },
  {
    title: t('views.jobGrade.status'),
    dataIndex: 'status',
    align: 'center',
    width: 80,
    resizable:false,
    defaultHidden:true
  },
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
  {
    field: 'gradeCode',
    label: t('views.jobGrade.gradeCode'),
    component: 'Input',
    itemProps:{
      labelAlign:'left'
    },
    labelWidth: 80,
    colProps: {span: 8, lg:{span: 8, offset:0}, sm:{span: 10, offset: 0}, xs:{span: 16, offset: 0}},
  },
  {
    field: 'gradeName',
    label: t('views.jobGrade.gradeName'),
    component: 'Input',
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
    field: 'gradeCode',
    label: t('views.jobGrade.gradeCode'),
    required: true,
    component: 'Input',
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'gradeName',
    label: t('views.jobGrade.gradeName'),
    required: true,
    component: 'Input',
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'gradeNameEn',
    label: t('views.jobGrade.gradeNameEn'),
    required: true,
    component: 'Input',
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'gradeRemark',
    label: t('views.jobGrade.gradeRemark'),
    required: false,
    component: 'Input',
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'gradeRemarkEn',
    label: t('views.jobGrade.gradeRemarkEn'),
    required: false,
    component: 'Input',
    show: true,
    colProps: { span: 24 },
  },
  {
    field: 'sort',
    label: t('views.jobGrade.sort'),
    required: false,
    component: 'InputNumber',
    show: true,
  },
  {
    field: 'status',
    label: t('views.jobGrade.status'),
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
