import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
// import {getPositionInfoTree} from "/@/api/org/positionInfo";
import { formatToDate, formatToDateTime } from "/@/utils/dateUtil";
import { UserLabelLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
import { useI18n } from '/@/hooks/web/useI18n';
import {Tag} from "ant-design-vue";
import {h} from 'vue'
const { t } = useI18n();
import {getCompanies} from "/@/api/org/company";

export const columns: BasicColumn[] = [
  // {
  //   title: t('views.personal.loginName'),
  //   dataIndex: 'loginName',
  //   width: 100,
  //   align: 'left',
  // },
  {
    title: t('views.personal.userCode'),
    dataIndex: 'userCode',
    width: 100,
    align: 'left'
  },
  {
    title: t('views.personal.userName'),
    dataIndex: 'userName',
    width: 100,
    align: 'left',
    customRender:({record}) => {
      let key = UserLabelLocaleLang[getLocale.value]
      return record[key]
    }
  },
  // {
  //   title: t('views.personal.userNameEn'),
  //   dataIndex: 'userNameEn',
  //   width: 100,
  //   align: 'left',
  // },
  // {
  //   title: t('views.personal.nickName'),
  //   dataIndex: 'nickName',
  //   width: 100,
  //   align: 'left',
  //   defaultHidden:true
  // },
  // {
  //   title: t('views.personal.firstName'),
  //   dataIndex: 'firstName',
  //   width: 100,
  //   align: 'left',
  //   defaultHidden:true
  // },
  // {
  //   title: t('views.personal.middleName'),
  //   dataIndex: 'middleName',
  //   width: 100,
  //   align: 'left',
  //   defaultHidden:true
  // },
  // {
  //   title: t('views.personal.lastName'),
  //   dataIndex: 'lastName',
  //   width: 100,
  //   align: 'left',
  //   defaultHidden:true
  // },
  // {
  //   title: t('views.personal.identity'),
  //   dataIndex: 'identity',
  //   width: 100,
  //   align: 'left',
  //   defaultHidden:true
  // },
  // {
  //   title: t('views.personal.birthday'),
  //   dataIndex: 'birthday',
  //   width: 100,
  //   align: 'left',
  //   defaultHidden:true
  // },
  // {
  //   title: t('views.personal.email'),
  //   dataIndex: 'email',
  //   width: 100,
  //   align: 'left',
  //   defaultHidden:true
  // },
  // {
  //   title: t('views.personal.phone'),
  //   dataIndex: 'phone',
  //   width: 100,
  //   align: 'left',
  // },
  // 性别
  {
    title: t('views.personal.sex'),
    dataIndex: 'sex',
    width: 50,
    align: 'center',
    customRender:({ record }) => {
      const sex = record.sex;
      const text = sex == 2 ? t('common.sex.unknown') :  (sex == 1 ? t('common.sex.men') : t('common.sex.woMen'));
      const color = sex == 2 ? 'blue' :  (sex == 1 ? 'green' : 'red');
      return h(Tag, {color}, () => text);
    },
    resizable:false
  },
  // {
  //   title: t('views.personal.roleName'),
  //   dataIndex: 'roleName',
  //   width: 100,
  //   align: 'left',
  //   customRender: ({ record }) => {
  //     return record.roleName || t('common.noSet');
  //   },
  //   defaultHidden:true
  // },
  // {
  //   title: t('views.personal.updatedAt'),
  //   dataIndex: 'updatedAt',
  //   width: 165,
  //   customRender:({text})=>{ 
  //     return text?formatToDateTime(text):'';
  //   },
  //   defaultHidden:true
  //   // // resizable:false
  // },
  // {
  //   title: t('views.personal.status'),
  //   dataIndex: 'status',
  //   width: 100,
  //   // // resizable:false
  // },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'userCode',
    label: t('views.personal.userCode'),
    component: 'Input',
    itemProps:{
      labelAlign:'left'
    },
    colProps: {span: 8, lg:{span: 8, offset:0}, sm:{span: 14, offset: 0}, xs:{span: 16, offset: 0}},
  },
  {
    field: 'userName',
    label: t('views.personal.userName'),
    component: 'Input',
    colProps: {span: 8, lg:{span: 8, offset:0}, sm:{span: 14, offset: 0}, xs:{span: 16, offset: 0}},
  },
  // {
  //   field:'email',
  //   labelWidth:80,
  //   label: t('views.personal.email'),
  //   component: 'Input',
  //   colProps: {span: 6, lg:{span: 6, offset:0}, sm:{span: 14, offset: 0}, xs:{span: 16, offset: 0}},
  // }
];

export const personalFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    required: false,
    component: 'Input',
    show: false,
  },
  {
    field: 'loginName',
    label: t('views.personal.loginName'),
    component: 'Input',
    required: true,
  },
  {
    field: 'password',
    label: t('views.personal.password'),
    component: 'InputPassword',
    required: true,
    defaultValue:'123456',
  },
  {
    field: 'userCode',
    label: t('views.personal.userCode'),
    component: 'Input',
    required: true,
  },
  {
    field: 'nickName',
    label: t('views.personal.nickName'),
    component: 'Input',
    required: false,
  },
  {
    field: 'userName',
    label: t('views.personal.userName'),
    component: 'Input',
    required: true,
  },
  {
    field: 'userNameEn',
    label: t('views.personal.userNameEn'),
    component: 'Input',
    required: true,
  },
  {
    field: 'firstName',
    label: t('views.personal.firstName'),
    component: 'Input',
    required: false,
  },
  {
    field: 'middleName',
    label: t('views.personal.middleName'),
    component: 'Input',
    required: false,
  },
  {
    field: 'lastName',
    label: t('views.personal.lastName'),
    component: 'Input',
    required: false,
  },
  {
    field: 'companyId',
    label: t('views.personal.companyName'),
    component: 'ApiTreeSelect',
    componentProps: {
      api: getCompanies,
      treeNodeFilterProp: 'companyName',
      getPopupContainer: () => document.body,
    },
    required: true,
  },
  {
    field: 'companyCode',
    label: 'companyCode',
    required: false,
    component: 'Input',
    show: false,
  },
  {
    field: 'deptId',
    label: t('views.personal.deptName'),
    component: 'TreeSelect',
    componentProps: {
      treeNodeFilterProp: 'deptName',
      getPopupContainer: () => document.body,
    },
    required: true,
  },
  {
    field: 'deptCode',
    label: 'deptCode',
    required: false,
    component: 'Input',
    show: false,
  },
  {
    field:'positionId',
    label: t('views.position.positionName'),
    required:true,
    component:'JSelectPosition',
    componentProps: {
      labelKey: 'positionName',
      isRadioSelection:true,
      showSelected:false,
      getSelectResult:(e) => {
        console.log('options,valueoptions,value',e)
      }
    },
  },
  {
    label: 'positionCode',
    field: 'positionCode',
    component: 'Input',
    show:false
  },
  {
    field: 'rankId',
    label: t('views.jobRank.rankName'),
    required:true,
    component: 'Select',
    componentProps: {
      // api: getPositionInfoTree,
      params:{
        status:1
      },
      fieldNames: {
        label:'rankName',
        value:'id'
      },
      treeNodeFilterProp: 'postName',
      getPopupContainer: () => document.body,
    },
  },
  {
    label: 'rankCode',
    field: 'rankCode',
    component: 'Input',
    show:false
  },
  {
    field: 'headPic',
    label: t('views.personal.headPic'),
    component: 'ImageUpload',
    componentProps: {
      count:1
    },
  },
  {
    field: 'identity',
    label: t('views.personal.identity'),
    component: 'Input',
    required: false,
  },
  {
    field: 'birthday',
    label: t('views.personal.birthday'),
    component: 'DatePicker',
    required: false,
    componentProps:{
      format:'YYYY-MM-DD',
      valueFormat:'YYYY-MM-DD',
    },
  },
  {
    label: t('views.personal.phone'),
    field: 'phone',
    component: 'Input',
    required: false,
  },
  {
    label: t('views.personal.email'),
    field: 'email',
    component: 'Input',
  },
  {
    field: 'sex',
    label: t('views.personal.sex'),
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: t('common.sex.woMen'), value: 0 },
        { label: t('common.sex.men'), value: 1 },
        { label: t('common.sex.unknown'), value: 2 },
      ],
    },
    
  },
  {
    label: t('views.personal.remark'),
    field: 'userRemark',
    component: 'InputTextArea',
  },
  {
    field: 'status',
    label: t('views.personal.status'),
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: t('common.enable'), value: 1 },
        { label: t('common.disenabled'), value: 0 },
      ],
    },
  },
];
