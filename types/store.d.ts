import { ErrorTypeEnum } from '/@/enums/exceptionEnum';
import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';
import { RoleInfo } from '/@/api/sys/model/userModel';

// Lock screen information
export interface LockInfo {
  // Password required
  pwd?: string | undefined;
  // Is it locked?
  isLock?: boolean;
}

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum;
  // Error file
  file: string;
  // Error name
  name?: string;
  // Error message
  message: string;
  // Error stack
  stack?: string;
  // Error detail
  detail: string;
  // Error url
  url: string;
  // Error time
  time?: string;
}

export interface UserInfo {
  userCode?:string,
  roles?:RoleInfo[],
  companyId: string;
  companyName: string;
  companyTenantId: string;
  deptTenantId: string;
  companyTenantName: string;
  imageInfo: any[];
  createdAt: string;
  createdBy: string;
  deptId: string;
  deptName: string;
  email: string;
  groupTenantId: string;
  language: string;
  headPic: string;
  id: string;
  loginDate: string;
  loginIp: string;
  mobile: string;
  userName: string;
  password: string;
  userCode: string,
  deptName:string,
  phone: string;
  postId: string;
  postName: string;
  roleId: string;
  roleName: string;
  sex: string;
  userRemark:string
}

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}
