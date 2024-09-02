import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';
import {PersonalParams} from "/@/api/org/model/personalModel";

export type RoleParams = {
  keyword?: string;
  companyId?: string;
  personalId?: string;
};

export type RolePageParams = BasicPageParams & RoleParams;

export type RoleInfo = {
  id: string;
  roleName: string;
  roleCode: string;
  roleRemark: string;
  sort: number;
};

export type PersonalByRoleParams = {
  roleId: string;
  userIds: string;
};

export type DelByRoleParams = {
  ids: string;
};
export interface RoleListItem extends RoleInfo {
  id: string;
}

/**
 * @description: Request list return value
 */

export type RolePageListGetResultModel = BasicFetchResult<RoleListItem>;
