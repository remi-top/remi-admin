import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import {Tag} from "ant-design-vue";
import {h} from 'vue'
import { useI18n } from '/@/hooks/web/useI18n';
import { PositionLabelLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
const { t } = useI18n();
export const columns: BasicColumn[] = [
  {
    title: t('views.position.positionCode'),
    dataIndex: 'positionCode',
    align: 'left',
    // width:120
  },
  {
    title: t('views.position.positionName'),
    dataIndex: 'positionName',
    align: 'left',
    customRender:({record}) => {
      let key = PositionLabelLocaleLang[getLocale.value]
      return record[key]
    },
    resizable:false
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    label: t('views.position.positionName'),
    field: 'positionName',
    component: 'Input',
    labelWidth:80,
    itemProps:{
      labelAlign:'left'
    },
    colProps: { span: 17 },
  },
]
