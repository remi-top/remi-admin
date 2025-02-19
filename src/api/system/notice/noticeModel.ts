import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel'

export type NoticeParams = {
};

export type NoticePageParams = BasicPageParams & NoticeParams;

export type NoticeInfo = {
  id?: 'string';
  appId?: 'string';
  appCode?: 'string';
  content?: 'string';
  operatorType?: 'string';
  businessType?: 'string';
  businessNo?: 'string';
  traceId?: 'string';
  userId?: 'string';
  userCode?: 'string';
  userName?: 'string';
  userNameEn?: 'string';
  userLanguage?: 'string';
  requestUrl?: 'string';
  requestMethod?: 'string';
  requestType?: 'string';
  contentType?: 'string';
  requestBody?: 'string';
  requestTime?: 'string';
  responseBody?: 'string';
  responseTime?: 'string';
  errorInfo?: 'string';
  executeTime?: 'string';
  platform?: 'string';
  browser?: 'string';
  userIp?: 'string';
  ipAddress?: 'string';
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
export type NoticePageListGetResultModel = BasicFetchResult<NoticeInfo>;