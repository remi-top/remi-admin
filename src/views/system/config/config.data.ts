import { Upload } from '/@/api/sys/file';
import { getAppList } from '/@/api/application/app/app'
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Form';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { UserLabelLocaleLang } from '/@/enums/appEnum';
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
const { t } = useI18n();
import { confType as confTypeMap1 } from '/@/views/application/app/app.data';

export const confType1 = {
  1:{
    label: t('views.config.config1'),
    value: 1,
    color: 'pink',
  }
}
export const confTypeMap  = Object.assign(confType1 ,confTypeMap1)

export const columns: BasicColumn[] = [
  {
    title: t('views.config.appId'),
    dataIndex: 'appId',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.config.appCode'),
    dataIndex: 'appCode',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.config.confType'),
    dataIndex: 'userName',
    width: 120,
    sorter: false,
    customRender: ({ record }) => {
      let confType = record.confType;
      const color = confTypeMap[confType]?.color;
      const text = confTypeMap[confType]?.label;
      return h(Tag, { color }, text);
    },
  },
  {
    title: t('views.config.confCode'),
    dataIndex: 'confCode',
    width: 100,
    align: 'center',
    sorter: false,
  },
  {
    title: t('views.config.confName'),
    dataIndex: 'confName',
    width: 100,
    align: 'center',
    sorter: false,
  },
  {
    title: t('views.config.confValue'),
    dataIndex: 'confValue',
    width: 100,
    align: 'center',
    sorter: false,
  },
  {
    title: t('views.config.status'),
    dataIndex: 'status',
    width: 100,
    align: 'center',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.config.createdBy'),
    dataIndex: 'createdBy',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.config.createdBy'),
    dataIndex: 'createdBy',
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
  {
    title: t('views.config.createdAt'),
    dataIndex: 'createdAt',
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
  {
    title: t('views.config.updatedBy'),
    dataIndex: 'updatedBy',
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
  {
    title: t('views.config.updatedAt'),
    dataIndex: 'updatedAt',
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'bindCode',
    label: t('views.app.appName'),
    component: 'ApiSelect',
    componentProps: {
      api:getAppList,
      labelField:'appName',
      valueField:'appCode'
    },
    labelWidth: 90,
    colProps: {
      span: 6,
    },
    itemProps: {
      labelAlign: 'left',
    },
  },
  {
    field: 'confType',
    label: t('views.config.confType'),
    component: 'Select',
    componentProps: {
      options: Object.values(confTypeMap),
    },
    colProps: {
      span: 6,
    }
  },
  {
    field: 'confCode',
    label: t('views.config.confCode'),
    component: 'Input',
    colProps: {
      span: 6,
    },
  },
  {
    field: 'confName',
    label: t('views.config.confName'),
    component: 'Input',
    colProps: {
      span: 6,
    },
    isAdvanced:false
  },
  {
    field: 'confValue',
    label: t('views.config.confValue'),
    component: 'Input',
    colProps: {
      span: 6,
    },
  },
  // {
  //   field: 'traceId',
  //   label: t('views.config.traceId'),
  //   component: 'Input',
  //   colProps: {
  //     span: 6,
  //   },
  // },
  // {
  //   field: 'requestUrl',
  //   label: t('views.config.requestUrl'),
  //   component: 'Input',
  //   colProps: {
  //     span: 6,
  //   },
  // },
  // {
  //   field: 'requestTime',
  //   label: t('views.config.requestTime'),
  //   component: 'Input',
  //   colProps: {
  //     span: 6,
  //   },
  // },
];
