export const SIDE_BAR_MINI_WIDTH = 70;
export const SIDE_BAR_SHOW_TIT_MINI_WIDTH = 70;

// 标签页样式
export enum TabsThemeEnum {
  // 圆滑
  SMOOTH = 'smooth',
  // 卡片
  CARD = 'card',
  // 极简
  SIMPLE = 'simple',
}

export enum ContentEnum {
  // auto width
  FULL = 'full',
  // fixed width
  FIXED = 'fixed',
}

// menu theme enum
export enum ThemeEnum {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum SettingButtonPositionEnum {
  AUTO = 'auto',
  HEADER = 'header',
  FIXED = 'fixed',
}

export enum SessionTimeoutProcessingEnum {
  ROUTE_JUMP,
  PAGE_COVERAGE,
}

/**
 * 权限模式
 */
export enum PermissionModeEnum {
  // role
  ROLE = 'ROLE',
  // 后台
  BACK = 'BACK',
  // route mapping
  ROUTE_MAPPING = 'ROUTE_MAPPING',
}

//  Route switching animation
export enum RouterTransitionEnum {
  ZOOM_FADE = 'zoom-fade',
  ZOOM_OUT = 'zoom-out',
  FADE_SIDE = 'fade-slide',
  FADE = 'fade',
  FADE_BOTTOM = 'fade-bottom',
  FADE_SCALE = 'fade-scale',
}
// 语言后端字段Map对应
export enum LanguageKeyLocaleLang {
  'zh_CN' = '',
  en = 'En',
  ZH = '',
  EN = 'En'
}
// 语言Map对应
export enum LocaleLang {
  'zh_CN' = 'zh_CN',
  'en' = 'en_US',
  'en_US' = 'en'
}
export enum MenuLocaleLang {
  'zh_CN' = 'menuName',
  'en' = 'menuNameEn'
}
export enum AppLogoLocaleLang {
  'zh_CN' = 'logoZh',
  'en' = 'logoEn'
}
export enum AppNameLocaleLang {
  'zh_CN' = 'appName',
  'en' = 'appNameEn'
}
export enum CompanyLabelLocaleLang {
  'zh_CN' = 'companyName',
  'en' = 'companyNameEn'
}
export enum CompanyAddressLocaleLang {
  'zh_CN' = 'companyAddress',
  'en' = 'companyAddressEn'
}
export enum DeptHeadNameLocaleLang {
  'zh_CN' = 'deptHeadName',
  'en' = 'deptHeadNameEn'
}
export enum DeptLabelLocaleLang {
  'zh_CN' = 'deptName',
  'en' = 'deptNameEn'
}
export enum CompanyTenantLabelLocaleLang {
  'zh_CN' = 'companyTenantName',
  'en' = 'companyTenantNameEn'
}
export enum PositionLabelLocaleLang {
  'zh_CN' = 'positionName',
  'en' = 'positionNameEn'
}
export enum PositionRemarkLocaleLang {
  'zh_CN' = 'positionRemark',
  'en' = 'positionRemarkEn'
}
export enum GradeLabelLocaleLang {
  'zh_CN' = 'gradeName',
  'en' = 'gradeNameEn'
}
export enum GradeRemarkLocaleLang {
  'zh_CN' = 'gradeRemark',
  'en' = 'gradeRemarkEn'
}
export enum GroupLabelLocaleLang {
  'zh_CN' = 'groupName',
  'en' = 'groupNameEn'
}
export enum GroupRemarkLocaleLang {
  'zh_CN' = 'groupRemark',
  'en' = 'groupRemarkEn'
}
export enum RankLabelLocaleLang {
  'zh_CN' = 'rankName',
  'en' = 'rankNameEn'
}
export enum RankRemarkLocaleLang {
  'zh_CN' = 'rankRemark',
  'en' = 'rankRemarkEn'
}
export enum UserLabelLocaleLang {
  'zh_CN' = 'userName',
  'en' = 'userNameEn'
}
export enum RoleNameLocaleLang {
  'zh_CN' = 'roleName',
  'en' = 'roleNameEn'
}
export enum RoleRemarkLocaleLang {
  'zh_CN' = 'roleRemark',
  'en' = 'roleRemarkEn'
}
export enum DictLocaleLang {
  'zh_CN' = 'dictName',
  'en' = 'dictNameEn'
}
export enum DictRemarkLocaleLang {
  'zh_CN' = 'dictRemark',
  'en' = 'dictRemarkEn'
}
export enum DictItemLocaleLang {
  'zh_CN' = 'itemText',
  'en' = 'itemTextEn'
}
export enum NoticeContentLocaleLang {
  'zh_CN' = 'noticeContent',
  'en' = 'noticeContentEn'
}