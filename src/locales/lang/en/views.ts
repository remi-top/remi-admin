export default {
  components: {
    notice:'Notice',
    application: 'Application',
    ApplicationVoucher: 'Application Voucher',
    orgDev: 'Developer',
    company: 'Company',
    dept: 'Department',
    userGroup: 'Business org',
    processCategory: 'Process classification',
    process:'process',
    userGroupSelectText: 'Please select a user group!',
    selectAppText: 'Please select an application!',
    gradeCategory: 'Grade',
    posts: 'Posts',
    menu: 'menu',
    rankCategory: 'Rank',
    org: 'providers',
    appPublish: 'app Publish',
    organization: 'Organization',
    empty: 'Empty',
    selectUser: 'Select User',
    selectPosition: 'Select User Group',
    selectOrg: 'Select Org',
    dict: 'Dictionaries',
    dictItem: 'Dictionaries Item',
    selectRole: 'select Role',
    roleSelector: {
      roleCode: 'Role code',
      roleName: 'Role name',
      roleRemark: 'Role remark',
      roleList: 'Role List',
      authRoleList: 'Authorized Role List',
      roleAssignmentDept: 'Assign roles to 【{0}】 department',
      roleAssignmentUser: 'Assign roles to 【{0}】 user',
      authSuccess: 'Authorization successful',
      authCancelSuccess: 'Cancel authorization successful',
    },
  },
  company: {
    addC: 'New subordinate company',
    addItemModalTitle: 'New【 {0} 】subordinate company',
    delCompanyMsg: 'There are subordinate companies that cannot be deleted !',
    companyCode: 'company code',
    companyName: 'Company name',
    companyNameEn: 'Company name(En)',
    companyAddress: 'Company address',
    companyAddressEn: 'Company address(En)',
    companyRemark: 'Company description',
    companyRemarkEn: 'Company description(En)',
    sort: 'Sort',
    createdAt: 'Creation time',
    status: 'Status',
  },
  dept: {
    addC: 'Add subordinate departments',
    settingLeader: 'Set a leader',
    addItemModalTitle: 'New【 {0} 】subordinate departments',
    delDeptMsg: 'There are subordinate departments that cannot be deleted !',
    deptCode: 'Department code',
    deptName: 'Department Name',
    deptNameEn: 'Department Name(En)',
    deptHeadName: 'Department head',
    companyName: 'Company name',
    phone: 'phone',
    email: 'email',
    sort: 'Sort',
    createdAt: 'Creation time',
    status: 'Status',
  },
  personal: {
    assignRoles: 'Assign roles',
    assignRoleToUser: 'Assign a role to {0}',
    userCode: 'User number',
    userName: 'User name',
    userNameEn: 'User name(English)',
    loginName: 'Login name',
    password: 'password',
    firstName: 'First name',
    middleName: 'Middle name',
    lastName: 'Last name',
    nickName: 'User nickname',
    birthday: 'Birthday',
    identity: 'Identity',
    email: 'Email',
    phone: 'Phone',
    deptName: 'Department name',
    roleName: 'Role name',
    updatedAt: 'Update time',
    status: 'Status',
    headPic: 'Profile picture',
    sex: 'Sex',
    systemPosition: 'System of position',
    classPosition: 'Class of position',
    position: 'Position',
    companyName: 'Company name',
    remark: 'Remark',
  },
  jobGrade: {
    gradeCode: 'Grade code',
    gradeName: 'Grade name',
    gradeNameEn: 'Grade name(En)',
    sort: 'Sort',
    gradeRemark: 'Remark',
    gradeRemarkEn: 'Remark(En)',
    status: 'Status',
  },
  jobRank: {
    rankCode: 'Rank code',
    rankName: 'Rank name',
    rankNameEn: 'Rank name(En)',
    sort: 'Sort',
    rankRemark: 'Remark',
    rankRemarkEn: 'Remark(En)',
    status: 'Status',
  },
  position: {
    positionCode: 'Position code',
    positionName: 'Position name',
    positionNameEn: 'Position name(En)',
    positionGrade: 'Position grade',
    positionRemark: 'Position remark',
    positionRemarkEn: 'Position remark(En)',
    sort: 'Sort',
    status: 'Status',
  },
  groupInfo: {
    addItemModalTitle: 'New【 {0} 】business org',
    groupCode: 'Business org code',
    groupName: 'Business org name',
    groupNameEn: 'Business org name(En)',
    groupGrade: 'Business org grade',
    groupRemark: 'Business org remark',
    groupRemarkEn: 'Business org remark(En)',
    sort: 'Sort',
    status: 'Status',
  },
  categoryInfo: {
    categoryCode: 'Category code',
    categoryName: 'Category name',
    categoryNameEn: 'Category name(En)',
    categoryGrade: 'Category grade',
    categoryRemark: 'Category remark',
    categoryRemarkEn: 'Category remark(En)',
    sort: 'Sort',
    status: 'Status',
  },
  role: {
    roleAssignmentMenu: 'Assign menus to 【 {0} 】 role',
    roleAssignmentDepts: 'Assign departments or users to【 { 0 } 】role',
    roleAssignmentDeptUsers: 'Assign 【 { 0 } 】 department users to【 { 1 } 】role',
    deptList: 'Department List',
    authDeptList: 'Authorized Department List',
    toRightAuthDept: 'Authorized Departments',
    toLeftCancelAuthDept: 'Cancel Authorization Departments',
    userList: 'User List',
    authUserList: 'Authorized User List',
    toRightAuthUser: 'Authorized Users',
    toLeftCancelAuthUser: 'Cancel Authorization Users',
    roleAssignmentUsers: 'Assign the users to 【 {0} 】',
    assignmentMenu: 'Menu Assignment',
    authSuccessTitle: 'Menu assignment successful',
    authSuccessDepts: 'Departments assignment role uccessful',
    authSuccess: 'Authorization successful',
    authCancelSuccess: 'Cancel authorization successful',
    addRole: 'New role',
    updateRole: 'Editor role',
    roleCode: 'Role coding',
    roleName: 'Role name',
    roleNameEn: 'Role name(En)',
    roleType: 'Role Type',
    roleRemark: 'Role remark',
    roleRemarkEn: 'Role remark(En)',
    status: 'Status',
    sort: 'Sort',
    createdAt: 'Creation time',
    actionMsg: 'Are you sure to 【{0}】 operation on the administrator role?',
    roleTypeMap1:'User Role',
    roleTypeMap2:'Organizational Role',
    roleTypeMap3:'Business Role',
    roleTypeMap4:'User Group Role',
    cordCode:"Organizational code",
    cordName:'Organization Name',
    cordType:'Organizational type',
    cordTypeMap1:'Company',
    cordTypeMap2:'Department'
  },
  menu: {
    show: 'show',
    hide: 'hide',
    cache: 'cache',
    uncached: 'uncached',
    yes: 'yes',
    no: 'no',
    addMenu: 'New menu',
    updateMenu: 'Editor menu',
    addCMenu: 'New【 {0} 】submenu',
    addC: 'New submenu',
    delItemMsg: 'There are submenus, can not be deleted!',
    menuName: 'Menu name',
    menuNameEn: 'Menu name(EN)',
    menuType: 'Menu type',
    menuCode: 'Menu code',
    menuPath: 'Menu path',
    menuComponent: 'Component path',
    controllerPath: 'Api url',
    menuPermission: 'Menu Permission',
    status: 'Status',
    visible: 'Menu visibility',
    keepAlive: 'Cache or not',
    sort: 'Sort',
    catalogue: 'Catalogue',
    menuText: 'Menu',
    btnText: 'Button',
    appCode: 'Application code',
    parentMenu: 'Parent menu',
    menuIcon: 'Icon',
    regUrlMsg: 'Please enter the correct URL address!',
    regPathMsg: 'Please enter the correct directory address!',
    tipMsg: 'Multiple comma separation',
    visibleMsg: 'Whether to display it on the menu bar',
  },
  dict: {
    id: 'id',
    dictCode: 'dictCode',
    dictName: 'dictName',
    dictNameEn: 'dictNameEn',
    dictRemark: 'dictRemark',
    dictRemarkEn: 'dictRemarkEn',
    status: 'status',
    deleted: 'deleted',
    revision: 'revision',
    deptTenantId: 'deptTenantId',
    companyTenantId: 'companyTenantId',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedBy: 'updatedBy',
    updatedAt: 'updatedAt',
  },
  dictItem: {
    id: 'id',
    dictId: 'dictId',
    dictCode: 'dictCode',
    itemValue: 'itemValue',
    itemText: 'itemText',
    itemTextEn: 'itemTextEn',
    itemRemark: 'itemRemark',
    itemRemarkEn: 'itemRemarkEn',
    isDefault: 'isDefault',
    itemStyle: 'itemStyle',
    itemCss: 'itemCss',
    sort: 'sort',
    status: 'status',
    deleted: 'deleted',
    revision: 'revision',
    deptTenantId: 'deptTenantId',
    companyTenantId: 'companyTenantId',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedBy: 'updatedBy',
    updatedAt: 'updatedAt',
  },
  logRecord: {
    id: 'id',
    appId: 'appId',
    appCode: 'appCode',
    content: 'content',
    operatorType: 'operatorType',
    businessType: 'businessType',
    businessType01:'New',
    businessType02:'Revise',
    businessType03:'Delete',
    businessType04:'Import',
    businessType05:'Export',
    businessType06:'Download',
    businessType07:'Upload',
    businessType08:'Authorization',
    businessType09:'Login',
    businessType10:'Log off',
    businessType11:'Forced retreat',
    businessType12:'Modify the status',
    businessType13:'Generate code',
    businessType14:'Clear the data',
    businessType15:'Update the cache',
    businessType99:'Other',
    businessNo: 'businessNo',
    traceId: 'traceId',
    userId: 'userId',
    userCode: 'userCode',
    userName: 'userName',
    userNameEn: 'userName(En)',
    userLanguage: 'userLanguage',
    requestUrl: 'requestUrl',
    requestMethod: 'requestMethod',
    requestType: 'requestType',
    contentType: 'contentType',
    requestBody: 'requestBody',
    requestTime: 'requestTime',
    responseBody: 'responseBody',
    responseTime: 'responseTime',
    errorInfo: 'errorInfo',
    executeTime: 'executeTime',
    platform: 'platform',
    browser: 'browser',
    userIp: 'userIp',
    ipAddress: 'ipAddress',
    status: 'status',
    deleted: 'deleted',
    revision: 'revision',
    deptTenantId: 'deptTenantId',
    companyTenantId: 'companyTenantId',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedBy: 'updatedBy',
    updatedAt: 'updatedAt',
    ErrorTime:'Error Time',
    ErrorUrl:'Error Url',
    ErrorContent:'Error Content'
  },
  app: {
    id: 'id',
    appCode: 'appCode',
    appKey: 'appKey',
    appSecret: 'appSecret',
    appName: 'appName',
    appNameEn: 'appNameEn',
    appRemark: 'appRemark',
    appRemarkEn: 'appRemarkEn',
    appIcp: 'appIcp',
    appIcon:'appIcon',
    appIconColor:'appIconColor',
    requestLimit: 'requestLimit',
    status: 'status',
    deleted: 'deleted',
    revision: 'revision',
    deptTenantId: 'deptTenantId',
    companyTenantId: 'companyTenantId',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedBy: 'updatedBy',
    updatedAt: 'updatedAt',
    BasicInfo: 'Basic Info',
    MemberInfo: 'Member Info',
    AppPublishInfo: 'App Publish Info',
  },
  orgDev: {
    id: 'id',
    devCode: 'devCode',
    devName: 'devName',
    devNameEn: 'devNameEn',
    nickName: 'nickName',
    phone: 'phone',
    email: 'email',
    sex: 'sex',
    status: 'status',
    deleted: 'deleted',
    revision: 'revision',
    deptTenantId: 'deptTenantId',
    companyTenantId: 'companyTenantId',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedBy: 'updatedBy',
    updatedAt: 'updatedAt',
  },
  org: {
    id: 'id',
    orgCode: 'orgCode',
    orgName: 'orgName',
    orgNameEn: 'orgNameEn',
    orgRemark: 'orgRemark',
    orgRemarkEn: 'orgRemarkEn',
    orgAddress: 'orgAddress',
    orgAddressEn: 'orgAddressEn',
    phone: 'phone',
    email: 'email',
    status: 'status',
    deleted: 'deleted',
    revision: 'revision',
    deptTenantId: 'deptTenantId',
    companyTenantId: 'companyTenantId',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedBy: 'updatedBy',
    updatedAt: 'updatedAt',
  },
  appDev: {
    id: 'id',
    appId: 'appId',
    appCode: 'appCode',
    appKey: 'appKey',
    devId: 'devId',
    devCode: 'devCode',
    permission: 'permission',
    admin: 'admin',
    status: 'status',
    deleted: 'deleted',
    revision: 'revision',
    deptTenantId: 'deptTenantId',
    companyTenantId: 'companyTenantId',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedBy: 'updatedBy',
    updatedAt: 'updatedAt',
  },
  appPublish: {
    id: 'id',
    appId: 'appId',
    appCode: 'appCode',
    appKey: 'appKey',
    appVersion: 'appVersion',
    sdtVersion: 'sdtVersion',
    fileName: 'fileName',
    fileUrl: 'fileUrl',
    fileSize: 'fileSize',
    auditUser: 'auditUser',
    aduitTime: 'aduitTime',
    status: 'status',
    deleted: 'deleted',
    revision: 'revision',
    deptTenantId: 'deptTenantId',
    companyTenantId: 'companyTenantId',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedBy: 'updatedBy',
    updatedAt: 'updatedAt',
  },
  processDesign:{
    categoryCode:'Process classification',
    processCode:'Process coding',
    processKey:'Process key',
    processName:'The name of the process',
    processIcon:'Process icons',
    processIconColor:'Icon background color',
    useFrom:'Whether or not to use forms',
    fromPath:'Approval form paths',
    version:'Process definition version',
    jsonName:'json文件名称',
    jsonContent:'json文件资源内容',
    bpmnName:'bpmn文件名称',
    bpmnContent:'bpmn文件资源内容',
    picture:'流程图文件路径',
    remark:'Process description',
    status:'state',
    updatedAt:'Updated',
  },
  config:{
    id:'ID',
    appId:'应用ID',
    appCode:'应用编码',
    confType:'Configuration type',
    confCode:'The CI encode',
    confName:'Configuration name',
    confValue:'Configure the value',
    sort:'Sort',
    status:'Status',
    // 1用户信息 2应用配置 3主题配置 4邮件配置 5存储配置 6支付配置 99其他配置
    config1:'User Information',
    config2:'App configuration',
    config3:'Theme configuration',
    config4:'Mail configuration',
    config5:'Storage configuration',
    config6:'Payment configuration',
    config99:'Other configuration',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedBy: 'updatedBy',
    updatedAt: 'updatedAt',
  }
};