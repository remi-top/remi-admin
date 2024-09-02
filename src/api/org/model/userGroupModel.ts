import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type UserGroupParams = {
  keyword?: string;
  typeCode?: string;
};

export type UserGroupPageParams = BasicPageParams & UserGroupParams;

export type UserGroupInfo = {
  code?: string;
  name?: string;
  orderNo?: number;
  creator?: string;
  createTime?: any;
  updator?: string;
  updateTime?: any;
  key?: string;
  value?: string;
  title?: string;
  isLeaf?: boolean;
};

/**
 * @description: Request list return value
 */
export type UserGroupPageListGetResultModel = BasicFetchResult<UserGroupInfo>;
