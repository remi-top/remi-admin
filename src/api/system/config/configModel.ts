import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel'

export type ConfigRecordParams = {
};

export type ConfigRecordPageParams = BasicPageParams & ConfigRecordParams;

export type ConfigRecordInfo = {
  id?: 'string';
  appId?: 'string';
  appCode?: 'string';
  confType?: 'string';
  confCode?: 'string';
  confName?: 'string';
  confValue?: 'string';
  sort?: 'string';
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
export type ConfigRecordPageListGetResultModel = BasicFetchResult<ConfigRecordInfo>;