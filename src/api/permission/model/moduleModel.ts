export type ModuleParams = {
  name?: string;
  status?: number;
  appCode?:string;
};

export type ModuleInfo = {
  appCpde?: string;
  appName?: string;
  id: string;
  name: string;
  url: string;
  sn: string;
  status: Number;
  image: string;
  orderNo: Number;
  pid: string;
  appId: string;
  state: Number;
  component: string;
  pvs: string;
};

export type AppInfo = {
  accessTokenValidity: string,
  appCode: string,
  appDomain: string,
  appKey: string,
  appName: string,
  appSecret: string,
  appType: string,
  authorities: string,
  grantTypes: string,
  id: string,
  redirectUrl: string,
  refreshTokenValidity: string,
  resourceIds: string,
  status: string,
  verifyStatus: string
};


/**
 * @description: Get menu interface
 */
export interface DeleteByIdsParams {
  appIds: [];
}
