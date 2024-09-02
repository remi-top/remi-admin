import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { Icon } from '/@/components/Icon';
import { getAppList } from '/@/api/application/app/app';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export const menuType = {
  1:{
    label: t('views.menu.catalogue'),
    value: 1,
    color:'blue'
  },
  2: {
    label: t('views.menu.menuText'),
    value: 2,
    color:'green'
  },
  3: {
    label: t('views.menu.btnText'),
    value: 3,
    color:'orange'
  },
};
export const columns: BasicColumn[] = [
  {
    title: t('views.menu.menuName'),
    dataIndex: 'menuName',
    align: 'left',
    customRender: ({ record }) => {
      const list = [h('span', record.menuName)];
      // if (record.menuIcon) {
      //   list.unshift(h(Icon, { icon: record.menuIcon }));
      // }
      return h('span', {}, list);
      // return h(Icon, { icon: record.image });
    },
  },
  {
    title: t('views.menu.menuNameEn'),
    dataIndex: 'menuNameEn',
    align: 'left',
    customRender: ({ record }) => {
      const list = [h('span', record.menuNameEn)];
      // if (record.menuIcon) {
      //   list.unshift(h(Icon, { icon: record.menuIcon }));
      // }
      return h('span', {}, list);
      // return h(Icon, { icon: record.image });
    },
  },
  {
    title: t('views.menu.menuIcon'),
    dataIndex: 'menuIcon',
    align: 'center',
    width:50,
    customRender: ({ record }) => {
      return h(Icon, { icon: record.menuIcon });
    },
  },
  {
    title:t('views.menu.menuType'),
    dataIndex: 'menuType',
    width:80,
    align: 'center',
    customRender:({record}) => {
      let value = record.menuType
      let color = menuType[value]?.color
      let text = menuType[value]?.label
      return h(Tag,{color},text)
    }
  },
  {
    title: t('views.menu.menuCode'),
    dataIndex: 'menuCode',
    align: 'left',
  },
  {
    title: t('views.menu.menuPath'),
    dataIndex: 'menuPath',
    align: 'left',
  },
  {
    title: t('views.menu.menuComponent'),
    dataIndex: 'menuComponent',
    align: 'left',
  },
  {
    title: t('views.menu.menuPermission'),
    dataIndex: 'menuPermission',
    align: 'left',
  },
  {
    title: t('views.menu.status'),
    dataIndex: 'status',
    align: 'center',
    width: 100,
    resizable: false,
  },
  {
    title: t('views.menu.visible'),
    dataIndex: 'visible',
    width: 100,
    resizable: false,
  },
  {
    title: t('views.menu.keepAlive'),
    dataIndex: 'keepAlive',
    width: 100,
    resizable: false,
  },
  // {
  //   title: '创建快捷方式',
  //   dataIndex: 'menuShortcut',
  //   width: 100,
  //   resizable: false,
  // },
  {
    title: t('views.menu.sort'),
    dataIndex: 'sort',
    align: 'center',
    width: 60,
    resizable: false,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'menuName',
    label: t('views.menu.menuName'),
    component: 'Input',
    itemProps:{
      labelAlign:'left'
    },
    colProps: {
      span: 8,
      lg: { span: 8, offset: 0 },
      sm: { span: 10, offset: 0 },
      xs: { span: 16, offset: 0 },
    },
  },
  {
    field: 'menuCode',
    label: t('views.menu.menuCode'),
    component: 'Input',
    colProps: {
      span: 8,
      lg: { span: 8, offset: 0 },
      sm: { span: 10, offset: 0 },
      xs: { span: 16, offset: 0 },
    },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'menuType',
    label: t('views.menu.menuType'),
    required: true,
    defaultValue: 1,
    component: 'RadioButtonGroup',
    componentProps: {
      options: Object.values(menuType),
    },
    show: true,
  },
  {
    field: 'appId',
    label: t('views.menu.appCode'),
    required: true,
    component: 'ApiTreeSelect',
    componentProps: {
      api: getAppList,
      params: {
        status: 1,
      },
      immediate: true,
      fieldNames: {
        label: 'appName',
        value: 'id',
      },
    },
    colProps: { span: 24 },
    show: true,
  },
  {
    field: 'appCode',
    label: 'appCode',
    required: false,
    component: 'Input',
    show: false,
  },
  {
    field: 'id',
    label: 'ID',
    required: false,
    component: 'Input',
    show: false,
  },
  {
    field: 'parentCode',
    label: 'parentCode',
    required: false,
    component: 'Input',
    show: false,
  },
  {
    field: 'parentId',
    label: t('views.menu.parentMenu'),
    required: false,
    component: 'ApiTreeSelect',
    dynamicDisabled: true,
    componentProps: {
      // api: getModules,
      immediate: false,
      fieldNames: {
        label: 'menuName',
        value: 'id',
      },
      colProps: { span: 24 },
    },
    show: true,
  },
  {
    field: 'menuIcon',
    label: t('views.menu.menuIcon'),
    component: 'IconPicker',
    componentProps: {
      // mode: 'svg'
    },
    colProps: { span: 24 },
  },
  {
    field: 'menuName',
    label: t('views.menu.menuName'),
    required: true,
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    field: 'menuNameEn',
    label: t('views.menu.menuNameEn'),
    required: true,
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    field: 'menuCode',
    label: t('views.menu.menuCode'),
    required: true,
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    field: 'menuPath',
    label: t('views.menu.menuPath'),
    component: 'Input',
    rules: [
      {
        pattern: new RegExp('^\\/?(\\w+\\/?)+(\\.?\\w+)?$'),
        type: 'string',
        message: t('views.menu.regUrlMsg'),
      },
    ],
    colProps: { span: 24 },
  },
  {
    field: 'menuComponent',
    label: t('views.menu.menuComponent'),
    component: 'Input',
    rules: [
      {
        pattern: new RegExp('^\\/?(\\w+\\/?)+(\\.?\\w+)?$'),
        type: 'string',
        message: t('views.menu.regPathMsg'),
      }
    ],
    colProps: { span: 24 },
  },
  {
    field: 'controllerPath',
    label: h('div',{},t('views.menu.controllerPath')),
    show: false,
    required: true,
    component: 'InputTextArea',
    componentProps: {
      rows: 4,
      placeholder: t('views.menu.tipMsg'),
    },
    colProps: { span: 24 },
  },
  // {
  //   field: 'menuType',
  //   label: '菜单类型',
  //   component: 'InputNumber',
  //   show: false,
  //   defaultValue:1
  // },
  {
    field: 'sort',
    label: t('views.menu.sort'),
    component: 'InputNumber',
    colProps: { span: 24 },
  },
  {
    field: 'status',
    label: t('views.menu.status'),
    required: false,
    component: 'Switch',
    defaultValue: 1,
    componentProps: {
      checkedChildren: t('common.enable'),
      unCheckedChildren: t('common.disenabled'),
      checkedValue: 1,
      unCheckedValue: 0,
    },
    colProps: { span: 8 },
  },
  {
    field: 'visible',
    label: t('views.menu.visible'),
    required: false,
    component: 'Switch',
    helpMessage: t('views.menu.visibleMsg'),
    defaultValue: 1,
    componentProps: {
      checkedChildren: t('views.menu.show'),
      unCheckedChildren:t('views.menu.hide'),
      checkedValue: 1,
      unCheckedValue: 0,
    },
    colProps: { span: 8 },
  },
  {
    field: 'keepAlive',
    label: t('views.menu.keepAlive'),
    required: false,
    component: 'Switch',
    defaultValue: 0,
    componentProps: {
      checkedChildren: t('views.menu.cache'),
      unCheckedChildren: t('views.menu.uncached'),
      checkedValue: 1,
      unCheckedValue: 0,
    },
    colProps: { span: 8 },
  },
  // {
  //   field: 'menuShortcut',
  //   label: '创建快捷方式',
  //   required: false,
  //   component: 'Switch',
  //   defaultValue: 0,
  //   componentProps: {
  //     checkedChildren: '是',
  //     unCheckedChildren: '否',
  //     checkedValue: 1,
  //     unCheckedValue: 0,
  //   },
  //   colProps: { span: 12 },
  // },
];

export const pValueFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    required: false,
    component: 'Input',
    show: false,
  },
  {
    field: 'menuPermission',
    label: ' ',
    required: false,
    component: 'CheckboxGroup',
    labelWidth: 10,
    componentProps: {},
  },
];
