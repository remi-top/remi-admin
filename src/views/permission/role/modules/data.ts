import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { UserLabelLocaleLang,PositionLabelLocaleLang,GradeLabelLocaleLang,CompanyLabelLocaleLang,DeptLabelLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
import { useI18n } from '/@/hooks/web/useI18n';
import {Tag} from "ant-design-vue";
import {h} from 'vue'
const { t } = useI18n();
export const cordTypeMap = {
  1:{
    label:t('views.role.cordTypeMap1'),
    value:1,
    color:'blue'
  },
  2:{
    label:t('views.role.cordTypeMap2'),
    value:2,
    color:'purple'
  },
}
export const columns: BasicColumn[] = [
  {
    title: t('views.personal.userCode'),
    dataIndex: 'userCode',
    // width: 100,
    align: 'left'
  },
  {
    title: t('views.personal.userName'),
    dataIndex: 'userName',
    // width: 100,
    align: 'left',
    customRender:({record}) => {
      let key = UserLabelLocaleLang[getLocale.value]
      return record[key]
    }
  },
  {
    title: t('views.personal.sex'),
    dataIndex: 'sex',
    // width: 50,
    align: 'center',
    customRender:({ record }) => {
      const sex = record.sex;
      const text = sex == 2 ? t('common.sex.unknown') :  (sex == 1 ? t('common.sex.men') : t('common.sex.woMen'));
      const color = sex == 2 ? 'blue' :  (sex == 1 ? 'green' : 'red');
      return h(Tag, {color}, () => text);
    },
    resizable:false
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'userName',
    label: t('views.personal.userName'),
    component: 'Input',
    itemProps:{
      labelAlign:'left'
    },
    colProps: {span: 8},
  },
  {
    field: 'userCode',
    label: t('views.personal.userCode'),
    component: 'Input',
    colProps: {span: 8},
  },
];
export const columnsPosition: BasicColumn[] = [
    {
      title: t('views.position.positionCode'),
      dataIndex: 'postCode',
      align: 'left',
      // width:80
    },
    {
      title: t('views.position.positionName'),
      dataIndex: 'postName',
      align: 'left',
      customRender:({record}) => {
        let key = PositionLabelLocaleLang[getLocale.value]
        return record[key]
      },
      resizable:false
    }
  ];
  
export const searchPositionFormSchema: FormSchema[] = [
  {
    field: 'postCode',
    label: t('views.position.positionCode'),
    component: 'Input',
    itemProps:{
      labelAlign:'left'
    },
    colProps: {span: 8},
  },
  {
    field: 'postName',
    label: t('views.position.positionName'),
    component: 'Input',
    colProps: {span: 8},
  },
];
export const columnsGroup: BasicColumn[] = [
  {
    title: t('views.groupInfo.groupCode'),
    dataIndex: 'groupCode',
    align: 'left',
    // width:80
  },
  {
    title: t('views.groupInfo.groupName'),
    dataIndex: 'groupName',
    align: 'left',
    customRender:({record}) => {
      let key = GradeLabelLocaleLang[getLocale.value]
      return record[key]
    },
    resizable:false
  },
];

export const searchGroupFormSchema: FormSchema[] = [
  {
    field: 'groupName',
    label: t('views.groupInfo.groupName'),
    component: 'Input',
    itemProps:{
      labelAlign:'left'
    },
    colProps: {span: 8},
  },
  {
    field: 'groupCode',
    label: t('views.groupInfo.groupCode'),
    component: 'Input',
    colProps: {span: 8},
  },
];
export const columnsCord: BasicColumn[] = [
  {
    title: t('views.role.cordCode'),
    dataIndex: 'cordCode',
    align: 'left',
    // width:80
  },
  {
    title: t('views.role.cordType'),
    dataIndex: 'groupName',
    align: 'center',
    customRender:({record}) => {
      let value = record.cordType
      let color = cordTypeMap[value]?.color
      let text = cordTypeMap[value]?.label
      return h(Tag,{color},text)
    },
    // width:80
  },
  {
    title: t('views.role.cordName'),
    dataIndex: 'cordName',
    align: 'left',
    customRender:({record}) => {
      let value = record.cordType
      let key = ""
      if(value == 1){
        key = CompanyLabelLocaleLang[getLocale.value]
      }
      if(value == 2){
        key = DeptLabelLocaleLang[getLocale.value]
      }
      return record[key]
    },
    resizable:false
  },
];

export const searchCordFormSchema: FormSchema[] = [
  
  {
    field: 'cordCode',
    label: t('views.role.cordCode'),
    component: 'Input',
    itemProps:{
      labelAlign:'left'
    },
    colProps: {span: 8},
  },
  {
    field: 'cordName',
    label: t('views.role.cordName'),
    component: 'Input',
    colProps: {span: 8},
  },
];