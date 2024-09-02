import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel'

export type AppParams = {
  appCode?: 'string';
  appName?: 'string';
};

export type AppPageParams = BasicPageParams & AppParams;

export type AppInfo = {
  id?: 'string';
  appCode?: 'string';
  appKey?: 'string';
  appSecret?: 'string';
  appName?: 'string';
  appNameEn?: 'string';
  appRemark?: 'string';
  appRemarkEn?: 'string';
  appIcp?: 'string';
  requestLimit?: 'string';
  key?: 'string';
  value?: 'string';
  title?: 'string';
  isLeaf?: boolean;
  status?: 'string';
  deleted?: 'string';
  revision?: 'string';
  deptTenantId?: 'string';
  companyTenantId?: 'string';
  createdBy?: 'string';
  createdAt?: 'string';
  updatedBy?: 'string';
  updatedAt?: 'string';
};

/**
 * @description: Request list return value
 */
export type AppPageListGetResultModel = BasicFetchResult<AppInfo>;