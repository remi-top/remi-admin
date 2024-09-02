import { BasicFetchResult } from '/@/api/model/baseModel';

export type DeptSearchParams = {
  keyword?: string;
  companyIds?: string;
  companyId?: string;
  deptId?: string;
};

export type DeptInfo = {
  id: string;
  companyId: string;
  deptName: string;
  deptCode: string;
  parentId: string;
  sort: number;
  leaderUserId: string;
};

export interface DeptListItem extends DeptInfo {
  companyIds: string;
}

/**
 * @description: Request list return value
 */

export type ListGetResultModel = BasicFetchResult<DeptListItem>;
