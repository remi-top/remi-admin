import type { RouteMeta } from 'vue-router';
export interface RouteItem {
  path: string;
  component: any;
  meta: RouteMeta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
}

export interface ModuleInfo {
  appCode: any;
  parentCode: any;
  menuCode: any;
  menuIcon: any;
  parentId: any;
  id: string;
  name: string;
  url: string;
  sn: string;
  status: string;
  image: string;
  orderNo: string;
  pid: string;
  appId: string;
  state: Number;
  component: string;
  pvs: string;
  menuType: string;
  path: string;
  showStatus:number;
  menuTree:ModuleInfo[]
}

export interface ModuleInfoObj {
  userMenus?:ModuleInfo,
  routeList?:ModuleInfo[],
  permissionCodeList?:ModuleInfo[],
}


/**
 * @description: Get menu interface
 */
export interface getMenuListByIdParams {
  id: number | string;
}

/**
 * @description: Get menu return value
 */
export type getMenuListByIdParamsResultModel = RouteItem[];
