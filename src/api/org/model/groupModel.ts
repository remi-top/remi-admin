import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type GroupParams = {
  keyword?: string;
  typeCode?: string;
};

export type GroupPageParams = BasicPageParams & GroupParams;

export type GroupInfo = {
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
export type GroupPageListGetResultModel = BasicFetchResult<GroupInfo>;
