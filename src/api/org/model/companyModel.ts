import { BasicFetchResult } from '/@/api/model/baseModel';

export type CompanyParams = {
  keyword?: string;
};

export type CompanyInfo = {
  id: string;
  parentId: string;
  companyName: string;
  companyCode: string;
  status: Number;
  sort: Number;
  companyRemark: string;
};

export interface CompanyListItem extends CompanyInfo {
  id: string;
}

/**
 * @description: Get menu interface
 */
export interface DeleteByIdsParams {
  appIds: [];
}

/**
 * @description: Request list return value
 */

export type CompanyListGetResultModel = BasicFetchResult<CompanyListItem>;
