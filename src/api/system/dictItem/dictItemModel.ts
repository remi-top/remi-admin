import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel'

export type DictItemParams = {
  itemValue?: 'string';
  itemText?: 'string';
};

export type DictItemPageParams = BasicPageParams & DictItemParams;

export type DictItemInfo = {
  id?: 'string';
  dictId?: 'string';
  dictCode?: 'string';
  itemValue?: 'string';
  itemText?: 'string';
  itemTextEn?: 'string';
  itemRemark?: 'string';
  itemRemarkEn?: 'string';
  isDefault?: 'string';
  itemStyle?: 'string';
  itemCss?: 'string';
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
export type DictItemPageListGetResultModel = BasicFetchResult<DictItemInfo>;