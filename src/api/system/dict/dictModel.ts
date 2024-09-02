import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel'

export type DictParams = {
  dictCode?: 'string';
  dictName?: 'string';
  dictNameEn?: 'string';
};

export type DictPageParams = BasicPageParams & DictParams;

export type DictInfo = {
  id?: 'string';
  dictCode?: 'string';
  dictName?: 'string';
  dictNameEn?: 'string';
  dictRemark?: 'string';
  dictRemarkEn?: 'string';
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
export type DictPageListGetResultModel = BasicFetchResult<DictInfo>;