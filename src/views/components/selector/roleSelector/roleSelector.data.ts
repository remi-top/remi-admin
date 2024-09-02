import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { RoleNameLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
const { t } = useI18n();
export const columns: BasicColumn[] = [
  {
    title: t('views.components.roleSelector.roleCode'),
    dataIndex: 'roleCode',
    width: 150,
    align: 'left',
    // resizable:false
  },
  {
    title: t('views.components.roleSelector.roleName'),
    dataIndex: 'roleName',
    width: 150,
    align: 'left',
    customRender:({record}) => {
      let key = RoleNameLocaleLang[getLocale.value]
      return record[key]
    }
  },
  // {
  //   title: t('views.components.roleSelector.roleRemark'),
  //   dataIndex: 'roleRemark',
  //   width: 120,
  //   align: 'left'
  // }
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'roleName',
    label: t('views.components.roleSelector.roleName'),
    component: 'Input',
    labelWidth: 75,
    colProps: {span: 12, lg:{span: 12, offset:0}, sm:{span: 10, offset: 0}, xs:{span: 16, offset: 0}},
  },
];
