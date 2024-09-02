import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import {Tag} from "ant-design-vue";
import {h} from 'vue'
import { useI18n } from '/@/hooks/web/useI18n';
import { GroupLabelLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
const { t } = useI18n();
import { cordTypeMap } from '/@/views/permission/role/modules/data'
export const columns: BasicColumn[] = [
  {
    title: t('views.role.cordCode'),
    dataIndex: 'cordCode',
    align: 'left',
  },
  {
    title: t('views.role.cordType'),
    dataIndex: 'groupName',
    align: 'left',
    customRender:({record}) => {
      let value = record.roleType
      let color = cordTypeMap[value]?.color
      let text = cordTypeMap[value]?.label
      return h(Tag,{color},text)
    }
  },
  {
    title: t('views.role.cordName'),
    dataIndex: 'cordName',
    align: 'left',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'cordName',
    label: t('views.role.cordName'),
    component: 'Input',
    itemProps:{
      labelAlign:'left'
    },
    labelWidth: 100,
    colProps: {span: 14},
  },
];
