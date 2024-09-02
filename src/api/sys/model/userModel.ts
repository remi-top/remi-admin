import { ModuleInfo } from './menuModel'
/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

export interface AuthLoginParams {
  code?: string;
  state?: number;
  redirectUrl?: string;
  ticket?: string;
  token?: string;
  authCode?: string;
  authType?: string;
  appKey?: string;
}

/**
 * @description: Get user information
 */
export interface GetUserInfoByUserIdParams {
  userId: string | number;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

export interface UserInfo {
  roles?:RoleInfo[],
  language: string;
  companyId: string;
  companyName: string;
  companyTenantId: string;
  createdAt: string;
  createdBy: string;
  deptId: string;
  deptName: string;
  email: string;
  groupTenantId: string;
  headPic: string;
  id: string;
  loginDate: string;
  loginIp: string;
  mobile: string;
  nickName: string;
  password: string;
  phone: string;
  postId: string;
  postName: string;
  roleId: string;
  roleName: string;
  sex: string;
}
/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
  ticket: string;
  authCode: string;
  accessToken: string;
}

export interface AuthLoginResultModel {
  accessToken: string ;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoByUserIdModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}
/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  userMenus?: ModuleInfo[],
  routeList?: ModuleInfo[],
  permissionCodeList?: ModuleInfo[],
  userRoles?: [],
  roles?:RoleInfo[],
  language?: string;
  deptTenantId: string;
  companyId: string;
  companyName: string;
  companyTenantId: string;
  createdAt: string;
  createdBy: string;
  deptId: string;
  deptName: string;
  email: string;
  groupTenantId: string;
  headPic: string;
  id: string;
  loginDate: string;
  loginIp: string;
  mobile: string;
  nickName: string;
  password: string;
  phone: string;
  postId: string;
  postName: string;
  roleId: string;
  roleName: string;
  sex: string;
}
