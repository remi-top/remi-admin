import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import {Tag} from "ant-design-vue";
import {h} from 'vue'
import { useI18n } from '/@/hooks/web/useI18n';
import { GroupLabelLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
const { t } = useI18n();
export const columns: BasicColumn[] = [
  {
    title: t('views.groupInfo.groupCode'),
    dataIndex: 'groupCode',
    align: 'left',
    // width:150
  },
  {
    title: t('views.groupInfo.groupName'),
    dataIndex: 'groupName',
    align: 'left',
    customRender:({record}) => {
      let key = GroupLabelLocaleLang[getLocale.value]
      return record[key]
    },
    resizable:false
  },

];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'groupName',
    label: t('views.groupInfo.groupName'),
    component: 'Input',
    labelWidth: 100,
    colProps: {span: 14},
  },
];
