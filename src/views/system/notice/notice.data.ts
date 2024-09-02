import { BasicColumn, FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { useI18n } from '/@/hooks/web/useI18n';
import { NoticeContentLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
const { t } = useI18n();
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { Icon } from '/@/components/Icon';
export const typeMap = {
  1:{
    label:'通知公告',
    value:1,
    color:'blue'
  },
}
export const columns: BasicColumn[] = [
  // {
  //   title: '图标',
  //   dataIndex: 'noticeIcon',
  //   align: 'center',
  //   width:80,
  //   customRender: ({ record }) => {
  //     return h(Icon, { icon: record.noticeIcon });
  //   },
  // },
  {
    title: '类型',
    dataIndex: 'noticeType',
    align: 'center',
    width: 120,
    customRender: ( { record } ) => {
      const noticeType = record.noticeType
      const text = typeMap[noticeType]?.label
      const color = typeMap[noticeType]?.color
      return h(Tag,{color},text)
    }
  },
  {
    title: '标题',
    dataIndex: 'titile',
    align: 'left',

  },
  // {
  //   title: '发布人',
  //   width: 100,
  //   dataIndex: 'sender',
  // },
  // {
  //   title: '公告内容',
  //   dataIndex: 'noticeContent',
  //   customRender:({record}) => {
  //     let key = NoticeContentLocaleLang[getLocale.value]
  //     return record[key]
  //   }
  // },
  // },
  // {
  //   title: '通告对象',
  //   dataIndex: 'msgType',
  //   width: 100,
  //   customRender: ({ text }) => {
  //     return render.renderDict(text, 'msg_type');
  //   },
  // },
  {
    title: '发布状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ record }) => {
      const color = record.status == '1' ? 'green' : 'gray';
      const text = record.status == '1' ? '开启' : '关闭';
      return render.renderTag(text, color);
    },
    resizable: false,
  },
  {
    title: '发布时间',
    width: 180,
    dataIndex: 'createdAt',
  },
  // {
  //   title: '撤销时间',
  //   width: 100,
  //   dataIndex: 'cancelTime',
  // },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '消息标题',
    component: 'Input',
    colProps: { span: 6 },
    itemProps: {
      labelAlign: 'left',
    },
  },
  {
    field: 'noticeType',
    label: '消息类型',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options:Object.values(typeMap)
    },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'titile',
    label: '标题',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '请输入标题',
    },
  },
  {
    field: 'noticeType',
    label: '消息类型',
    required: true,
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options:Object.values(typeMap)
    },
  },
  {
    field: 'status',
    label: '状态',
    defaultValue: 1,
    required: false,
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        { label: t('common.enable'), value: 1 },
        { label: t('common.disenabled'), value: 0 },
      ],
    },
    colProps: {
       span: 24,
    },
  },
  // {
  //   field: 'msgAbstract',
  //   label: '摘要',
  //   component: 'InputTextArea',
  //   required: true,
  // },
  // {
  //   field: 'endTime',
  //   label: '截至日期',
  //   component: 'DatePicker',
  //   componentProps: {
  //     showTime: true,
  //     valueFormat: 'YYYY-MM-DD HH:mm:ss',
  //     placeholder: '请选择截至日期',
  //   },
  //   dynamicRules: ({ model }) => rules.endTime(model.startTime, true),
  // },
  // {
  //   field: 'msgType',
  //   label: '接收用户',
  //   defaultValue: 'ALL',
  //   component: 'JDictSelectTag',
  //   required: true,
  //   componentProps: {
  //     type: 'radio',
  //     dictCode: 'msg_type',
  //     placeholder: '请选择发布范围',
  //   },
  // },
  // {
  //   field: 'userIds',
  //   label: '指定用户',
  //   component: 'JSelectUser',
  //   required: true,
  //   componentProps: {
  //     rowKey: 'id',
  //     labelKey: 'username',
  //   },
  //   ifShow: ({ values }) => values.msgType == 'USER',
  // },
  // {
  //   field: 'priority',
  //   label: '优先级',
  //   defaultValue: 'H',
  //   component: 'JDictSelectTag',
  //   componentProps: {
  //     dictCode: 'priority',
  //     type: 'radio',
  //     placeholder: '请选择优先级',
  //   },
  // },
  {
    field: 'noticeContent',
    label: '中文内容',
    component: 'Input',
    render: render.renderTinymce,
  },
];
