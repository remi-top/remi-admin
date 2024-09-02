import { Upload } from '/@/api/sys/file';
import { computed, onMounted, ref } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { primaryColor } from '../../../../build/config/themeConfig';
const { t } = useI18n();
export const UploadImageKeys = ['SITE_LOGO','SITE_FAVICON']
export const confType = {
  // 1:{
  //   label: t('views.config.config1'),
  //   value: 1,
  //   color: 'pink',
  // },
  2: {
    label: t('views.config.config2'),
    value: 2,
    color: 'red',
    list:[
      // {
      //   field: 'SITE_LOGO',
      //   label: '系统LOGO',
      //   component: 'ImageUpload',
      //   show:true,
      //   componentProps: {
      //     api: Upload,
      //     count:1
      //   },
      //   colProps:{
      //     span:12
      //   }
      // },
      // {
      //   field: 'SITE_FAVICON',
      //   label: 'favicon',
      //   helpMessage:'用于显示浏览器地址栏的系统LOGO。',
      //   component: 'ImageUpload',
      //   show:true,
      //   componentProps: {
      //     api: Upload,
      //     count:1,
      //     fileType:['ico']
      //   },
      //   colProps:{
      //     span:12
      //   }
      // },
      {
        field: 'SITE_TITLE',
        label: '系统标题',
        helpMessage:'用于显示登录页面的系统标题。',
        component: 'Input',
        show:true,
        componentProps: {
          autoComplete:'off',
        },
        colProps:{
          span:13,
        }
      },
      {
        field: 'SITE_DESCRIPTION',
        label: '系统描述',
        helpMessage:'用于显示登录页面的系统描述。',
        component: 'Input',
        show:true,
        componentProps: {
          autoComplete:'off',
        },
        colProps:{
          span:13,
        }
      },
      {
        field: 'SITE_COPYRIGHT',
        label: '版权信息',
        component: 'Input',
        show:true,
        componentProps: {
          autoComplete:'off',
        },
        colProps:{
          span:13,
        }
      },
      {
        field: 'SITE_BEIAN',
        label: '备案号',
        component: 'Input',
        show:true,
        componentProps: {
          autoComplete:'off',
        },
        colProps:{
          span:13,
        }
      },
    ]
  },
  3: {
    label: t('views.config.config3'),
    value: 3,
    color: 'orange',
    list:[
      // {
      //   field: 'config3',
      //   label:t('views.config.config3'),
      //   component: 'Input',
      //   show:false,
      //   colProps:{
      //     span:12
      //   }
      // }
    ]
  },
  4: {
    label: t('views.config.config4'),
    value: 4,
    color: 'green',
    list:[
      {
        field: 'MAIL_PROTOCOL',
        label: '发送协议',
        component: 'Select',
        show:false,
        isAdvanced:true,
        defaultValue:'smtp',
        componentProps: {
          autoComplete:'off',
          options:[
            {
              value: 'smtp',
              label:'SMTP'
            }
          ]
        },
        colProps:{
          span:13,
          // offset:2
        }
      },
      {
        field: 'MAIL_HOST',
        label: '服务器地址',
        component: 'Input',
        show:false,
        componentProps: {
          autoComplete:'off',
        },
        colProps:{
          span:13
        }
      },
      {
        field: 'MAIL_PORT',
        label: '服务器端口',
        component: 'Input',
        show:false,
        componentProps: {
          autoComplete:'off',
        },
        colProps:{
          span:13
        }
      },
      {
        field: 'MAIL_USERNAME',
        label: '发件人名称',
        component: 'Input',
        show:false,
        componentProps: {
          autoComplete:'off',
        },
        colProps:{
          span:13
        }
      },
      {
        field: 'SENDER_EMAIL',
        label: '发件人邮箱',
        component: 'Input',
        show:false,
        componentProps: {
          autoComplete:'off',
        },
        colProps:{
          span:13
        }
      },
      {
        field: 'MAIL_PASSWORD',
        label: '邮箱密码',
        component: 'InputPassword',
        show:false,
        componentProps: {
          autoComplete:'off',
        },
        colProps:{
          span:13
        }
      },
      {
        field: 'MAIL_CODE',
        label: '邮件编码',
        component: 'Select',
        show:false,
        componentProps: {
          autoComplete:'off',
          options:[
            {
              value: 'GBK',
              label:'GBK'
            },
            {
              value: 'UTF-8',
              label:'UTF-8'
            }
          ]
        },
        colProps:{
          span:13
        }
      },
      {
        field: 'MAIL_SSL_ENABLED',
        label: '是否启动SSL',
        component: 'RadioGroup',
        show:false,
        defaultValue:'0',
        componentProps: {
          autoComplete:'off',
          options:[
            {
              label:'是',
              value:'1'
            },
            {
              label:'否',
              value:'0'
            }
          ]
        },
        colProps:{
          span:13
        }
      },
      {
        field: 'MAIL_SSL_PORT',
        label: 'SSL端口',
        component: 'Input',
        show:false,
        componentProps: {
          autoComplete:'off',
        },
        colProps:{
          span:13
        }
      },
    ]
  },
  5: {
    label: t('views.config.config5'),
    value: 5,
    color: 'cyan',
    list:[
      // {
      //   field: 'config5',
      //   label: t('views.config.config5'),
      //   component: 'Input',
      //   show:false,
      //   colProps:{
      //     span:12
      //   }
        
      // },
    ]
  },
  6: {
    label: t('views.config.config6'),
    value: 6,
    color: 'blue',
    list:[
      // {
      //   field: 'config6',
      //   label: t('views.config.config6'),
      //   component: 'Input',
      //   show:false,
      //   colProps:{
      //     span:12
      //   }
        
      // },
    ]
  },
  99: {
    label: t('views.config.config99'),
    value: 99,
    color: 'purple',
    list:[
      // {
      //   field: 'bindId00',
      //   label: t('views.config.config99'),
      //   component: 'Input',
      //   show:false,
      //   colProps:{
      //     span:12
      //   }
        
      // },
    ]
  },
};
export const colorList:string[] = [
  '#f5222d',
  '#fa541c',
  '#faad14',
  '#13c2c2',
  '#52c41a',
  '#1890ff',
  '#2f54eb',
  '#722ed1',
  '#bae7ff',
  '#d9f7be',
  '#efdbff',
  '#ffe7ba',
  '#fffb8f',
  '#ffd6e7',
  '#d6e4ff'
]
// 每行个数
export const grid = ref(12);
// slider属性
export const useSlider = (min = 6, max = 12) => {
  // 每行显示个数滑动条
  const getMarks = () => {
    const l = {};
    for (let i = min; i < max + 1; i++) {
      l[i] = {
        style: {
          color: '#fff',
        },
        label: i,
      };
    }
    return l;
  };
  return {
    min,
    max,
    marks: getMarks(),
    step: 1,
  };
};
export const columns: BasicColumn[] = [
  {
    title: t('views.app.id'),
    dataIndex: 'id',
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
  {
    title: t('views.app.appCode'),
    dataIndex: 'appCode',
    align: 'left',
    sorter: false
  },
  {
    title: t('views.app.appName'),
    dataIndex: 'appName',
    align: 'left',
    sorter: false
  },
  {
    title: t('views.app.appNameEn'),
    dataIndex: 'appNameEn',
    align: 'left',
    sorter: false
  },
  {
    title: t('views.app.appRemark'),
    dataIndex: 'appRemark',
    align: 'left',
    sorter: false
  },
  {
    title: t('views.app.appRemarkEn'),
    dataIndex: 'appRemarkEn',
    align: 'left',
    sorter: false
  },
  {
    title: t('views.app.appIcp'),
    dataIndex: 'appIcp',
    align: 'left',
    sorter: false
  },
  {
    title: t('views.app.requestLimit'),
    dataIndex: 'requestLimit',
    align: 'left',
    sorter: false
  },
  {
    title: t('views.app.status'),
    dataIndex: 'status',
    align: 'left',
    sorter: false
  },
  {
    title: t('views.app.createdBy'),
    dataIndex: 'createdBy',
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
  {
    title: t('views.app.createdAt'),
    dataIndex: 'createdAt',
    align: 'left',
    sorter: false,
    defaultHidden:true
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'appCode',
    label: '',
    component: 'Input',
    slot:'appCode',
    colProps: {
      span: 18,
    },
  },
  {
    field: 'appName',
    label: '',
    labelWidth:5,
    slot:'appName',
    component: 'Input',
    colProps: {
      span: 6,
    },
  },
];
export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: t('views.app.id'),
    defaultValue: '',
    required: false,
    component: 'Input',
    show:false,
  },
  {
    field: 'appCode',
    label: t('views.app.appCode'),
    defaultValue: '',
    slot:'appCode',
    required: false,
    dynamicDisabled:true,
    component: 'Input',
    componentProps: {
    },
    colProps:{
      span:6
    },
  },
  {
    field: 'appKey',
    label: t('views.app.appKey'),
    defaultValue: '',
    required: false,
    show:false,
    slot:'appKey',
    component: 'Input',
    colProps:{
      span:6
    },
    componentProps: {
    }
  },
  { 
    field: 'appSecret',
    label: t('views.app.appSecret'),
    defaultValue: '',
    required: false,
    slot:'appSecret',
    show:false,
    component: 'Input',
    colProps:{
      span:12
    },
    componentProps: {
    }
  },
  {
    field: 'appName',
    label: t('views.app.appName'),
    defaultValue: '',
    required: true,
    component: 'Input',
    componentProps: {
    },
    colProps:{
      span:12
    }
  },
  {
    field: 'appNameEn',
    label: t('views.app.appNameEn'),
    defaultValue: '',
    required: true,
    component: 'Input',
    componentProps: {
    },
    colProps:{
      span:12
    }
  },
  {
    field: 'appIcon',
    label: t('views.app.appIcon'),
    defaultValue: '',
    required: true,
    component: 'IconPicker',
    componentProps: {
      iconBgColor:'#1890ff'
    },
    colProps:{
      span:12
    }
  },
  {
    field: 'appIconColor',
    label: t('views.app.appIconColor'),
    defaultValue: '#1890ff',
    required: true,
    component: 'Select',
    slot:'setBgColor',
    componentProps: {
    },
    colProps:{
      span:12
    }
  },
  {
    field: 'appRemark',
    label: t('views.app.appRemark'),
    defaultValue: '',
    required: false,
    component: 'InputTextArea',
    componentProps: {
    },
    colProps:{
      span:12
    }
  },
  {
    field: 'appRemarkEn',
    label: t('views.app.appRemarkEn'),
    defaultValue: '',
    required: false,
    component: 'InputTextArea',
    componentProps: {
    },
    colProps:{
      span:12
    }
  },
  // {
  //   field: 'appIcp',
  //   label: t('views.app.appIcp'),
  //   defaultValue: '',
  //   required: false,
  //   component: 'Input',
  //   componentProps: {
  //   },
  //   colProps:{
  //     span:12
  //   }
  // },
  // {
  //   field: 'requestLimit',
  //   label: t('views.app.requestLimit'),
  //   defaultValue: '',
  //   required: false,
  //   component: 'InputNumber',
  //   componentProps: {
  //   },
  //   colProps:{
  //     span:12
  //   }
  // },
  {
    field: 'status',
    label: t('views.org.status'),
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
  //   field: '',
  //   label: '全局配置',
  //   required: false,
  //   component: 'Divider',
  //   componentProps: {
  //     // style: {
  //     //   'border-color': primaryColor,
  //     //   'margin-bottom': '35px',
  //     // },
  //   },
  //   colProps:{
  //     span:24
  //   }
  // },
  {
    field: 'configList',
    label: ' ',
    labelWidth:30,
    defaultValue: '#1890ff',
    required: false,
    component: 'Select',
    slot:'setConfig',
    componentProps: {
    },
    colProps:{
      span:24
    }
  },
];