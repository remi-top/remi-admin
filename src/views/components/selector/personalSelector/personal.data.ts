import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import {Tag} from "ant-design-vue";
import {h} from 'vue'
import { useI18n } from '/@/hooks/web/useI18n';
import { UserLabelLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
const { t } = useI18n();
export const columns: BasicColumn[] = [
  {
    title: t('views.personal.loginName'),
    dataIndex: 'loginName',
    width: 100,
    align: 'left',
  },
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
  {
    title: t('views.personal.nickName'),
    dataIndex: 'nickName',
    width: 100,
    align: 'left',
    defaultHidden:true
  },
  {
    title: t('views.personal.firstName'),
    dataIndex: 'firstName',
    width: 100,
    align: 'left',
    defaultHidden:true
  },
  {
    title: t('views.personal.middleName'),
    dataIndex: 'middleName',
    width: 100,
    align: 'left',
    defaultHidden:true
  },
  {
    title: t('views.personal.lastName'),
    dataIndex: 'lastName',
    width: 100,
    align: 'left',
    defaultHidden:true
  },
  {
    title: t('views.personal.identity'),
    dataIndex: 'identity',
    width: 100,
    align: 'left',
    defaultHidden:true
  },
  {
    title: t('views.personal.birthday'),
    dataIndex: 'birthday',
    width: 100,
    align: 'left',
    defaultHidden:true
  },
  {
    title: t('views.personal.email'),
    dataIndex: 'email',
    width: 100,
    align: 'left',
    defaultHidden:true
  },
  {
    title: t('views.personal.phone'),
    dataIndex: 'phone',
    width: 100,
    align: 'left',
    defaultHidden:true 
  },
  // 性别
  {
    title: t('views.personal.sex'),
    dataIndex: 'sex',
    width: 100,
    align: 'left',
    customRender:({ record }) => {
      const sex = record.sex;
      const text = sex == 2 ? t('common.sex.unknown') :  (sex == 1 ? t('common.sex.men') : t('common.sex.woMen'));
      const color = sex == 2 ? 'blue' :  (sex == 1 ? 'green' : 'red');
      return h(Tag, {color}, () => text);
    }
  },
  {
    title: t('views.personal.roleName'),
    dataIndex: 'roleName',
    width: 100,
    align: 'left',
    customRender: ({ record }) => {
      return record.roleName || t('common.noSet');
    },
    defaultHidden:true
  },
  {
    title: t('views.personal.updatedAt'),
    dataIndex: 'updatedAt',
    width: 165,
    customRender:({text})=>{
      return text?formatToDateTime(text):'';
    },
    defaultHidden:true
    // // resizable:false
  },
  {
    title: t('views.personal.status'),
    dataIndex: 'status',
    align: 'center',
    width: 100,
    defaultHidden:true
    // // resizable:false
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'loginName',
    label: t('views.personal.loginName'),
    component: 'Input',
    labelWidth:60,
    itemProps:{
      labelAlign:'left'
    },
    colProps: {span: 9},
  },
  {
    field: 'userName',
    labelWidth:80,
    label: t('views.personal.userName'),
    component: 'Input',
    colProps: {span:9},
  },
  // {
  //   field:'email',
  //   labelWidth:50,
  //   label: t('views.personal.email'),
  //   component: 'Input',
  //   colProps: {span: 6, lg:{span: 6, offset:0}, sm:{span: 14, offset: 0}, xs:{span: 16, offset: 0}},
  // }
];
