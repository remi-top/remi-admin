import { Upload } from '/@/api/sys/file';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { UserLabelLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
const { t } = useI18n();
export const businessTypeMap  = {
  // 1新增 2修改 3删除 4导入 5导出 6下载 7上传 8授权 9登录 10登出 11强退 12修改状态 13生成代码 14清空数据 15更新缓存 99其他
  1:{
    label:t('views.logRecord.businessType01'),
    value:1
  },
  2:{
    label:t('views.logRecord.businessType02'),
    value:2
  },
  3:{
    label:t('views.logRecord.businessType03'),
    value:3
  },
  4:{
    label:t('views.logRecord.businessType04'),
    value:4
  },
  5:{
    label:t('views.logRecord.businessType05'),
    value:5
  },
  6:{
    label:t('views.logRecord.businessType06'),
    value:6
  },
  7:{
    label:t('views.logRecord.businessType07'),
    value:7
  },
  8:{
    label:t('views.logRecord.businessType08'),
    value:8
  },
  9:{
    label:t('views.logRecord.businessType09'),
    value:9
  },
  10:{
    label:t('views.logRecord.businessType10'),
    value:10
  },
  11:{
    label:t('views.logRecord.businessType11'),
    value:11
  },
  12:{
    label:t('views.logRecord.businessType12'),
    value:12
  },
  13:{
    label:t('views.logRecord.businessType13'),
    value:13
  },
  14:{
    label:t('views.logRecord.businessType14'),
    value:14
  },
  15:{
    label:t('views.logRecord.businessType15'),
    value:15
  },
  99:{
    label:t('views.logRecord.businessType99'),
    value:99
  }
}
export const operatorTypeMap = {
  1:{
    label:'管理端用户',
    value:1
  },
  2:{
    label:'移动端用户',
    value:2
  },
  99:{
    label:'其他',
    value:99
  },
}
export const columns: BasicColumn[] = [
  {
    title: t('views.logRecord.id'),
    dataIndex: 'id',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.logRecord.appId'),
    dataIndex: 'appId',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.logRecord.appCode'),
    dataIndex: 'appCode',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.logRecord.userName'),
    dataIndex: 'userName',
    width: 120,
    sorter: false,
    customRender:({record}) => {
      let key = UserLabelLocaleLang[getLocale.value]
      return record[key]
    }
  },
  {
    title: t('views.logRecord.businessType'),
    dataIndex: 'businessType',
    width: 120,
    align: 'center',
    sorter: false,
    customRender: ( { record } ) => {
      const businessType = record.businessType
      const text = businessTypeMap[businessType]?.label
      return text
    }
  },
  {
    title: t('views.logRecord.content'),
    dataIndex: 'content',
    align: 'left',
    sorter: false,
    ellipsis:false,
    minWidth:150
  },
  // {
  //   title: t('views.logRecord.operatorType'),
  //   dataIndex: 'operatorType',
  //   width: 120,
  //   align: 'left',
  //   sorter: false,
  //   customRender: ( { record } ) => {
  //     const operatorType = record.operatorType
  //     const text = operatorTypeMap[operatorType]?.label
  //     return text
  //   }
  // },
  {
    title: t('views.logRecord.businessNo'),
    dataIndex: 'businessNo',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.logRecord.traceId'),
    dataIndex: 'traceId',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.logRecord.userId'),
    dataIndex: 'userId',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.logRecord.userCode'),
    dataIndex: 'userCode',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.logRecord.userLanguage'),
    dataIndex: 'userLanguage',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.logRecord.requestUrl'),
    dataIndex: 'requestUrl',
    align: 'left',
    sorter: false,
  },
  {
    title: t('views.logRecord.createdAt'),
    dataIndex: 'createdAt',
    align: 'center',
    sorter: false,
  },
  {
    title: t('views.logRecord.requestMethod'),
    dataIndex: 'requestMethod',
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.logRecord.requestType'),
    dataIndex: 'requestType',
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.logRecord.contentType'),
    dataIndex: 'contentType',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.logRecord.requestBody'),
    dataIndex: 'requestBody',
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.logRecord.requestTime'),
    dataIndex: 'requestTime',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.logRecord.responseBody'),
    dataIndex: 'responseBody',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.logRecord.responseTime'),
    dataIndex: 'responseTime',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.logRecord.errorInfo'),
    dataIndex: 'errorInfo',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.logRecord.executeTime'),
    dataIndex: 'executeTime',
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.logRecord.platform'),
    dataIndex: 'platform',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.logRecord.browser'),
    dataIndex: 'browser',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.logRecord.userIp'),
    dataIndex: 'userIp',
    width: 150,
    align: 'center',
    sorter: false,
  },
  {
    title: t('views.logRecord.ipAddress'),
    dataIndex: 'ipAddress',
    width: 150,
    align: 'center',
    sorter: false,
  },
  {
    title: t('views.logRecord.platform'),
    dataIndex: 'platform',
    width: 150,
    align: 'center',
    sorter: false,
  },
  {
    title: t('views.logRecord.browser'),
    dataIndex: 'browser',
    width: 150,
    align: 'center',
    sorter: false,
  },
  {
    title: t('views.logRecord.status'),
    dataIndex: 'status',
    width: 100,
    align: 'center',
    sorter: false,
    defaultHidden: true,
  },
  {
    title: t('views.logRecord.createdBy'),
    dataIndex: 'createdBy',
    width: 100,
    align: 'left',
    sorter: false,
    defaultHidden: true,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'userName',
    label: t('views.logRecord.userName'),
    component: 'Input',
    labelWidth:80,
    colProps: {
      span: 6,
    },
    itemProps: {
      labelAlign: 'left',
    },
  },
  {
    field: 'content',
    label: t('views.logRecord.content'),
    component: 'Input',
    labelWidth:80,
    colProps: {
      span: 6,
    },
  },
  {
    field: 'businessType',
    label: t('views.logRecord.businessType'),
    component: 'Select',
    componentProps: {
      options:Object.values(businessTypeMap)
    },
    labelWidth:100,
    colProps: {
      span: 6,
    },
  },
  // {
  //   field: 'traceId',
  //   label: t('views.logRecord.traceId'),
  //   component: 'Input',
  //   colProps: {
  //     span: 6,
  //   },
  // },
  // {
  //   field: 'requestUrl',
  //   label: t('views.logRecord.requestUrl'),
  //   component: 'Input',
  //   colProps: {
  //     span: 6,
  //   },
  // },
  // {
  //   field: 'requestTime',
  //   label: t('views.logRecord.requestTime'),
  //   component: 'Input',
  //   colProps: {
  //     span: 6,
  //   },
  // },
];