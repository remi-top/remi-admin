import {
  RoleInfo,
  RolePageListGetResultModel,
  RolePageParams,
  PersonalByRoleParams,
  DelByRoleParams
} from './model/roleModel';
import {BasicPageSearchParams, CheckExistParams} from "/@/api/model/baseModel";

import {defHttp} from '/@/utils/http/axios';
import {PersonalInfo} from "/@/api/org/model/personalModel";
import {PersonalRoleParams} from "/@/api/org/model/personalRoleModel";

enum Api {
  Page = '/role/page',
  List = '/role/list',
  UserList = '/user/page',
  RoleInfo = '/role/',
  Save = '/role/add',
  Update = '/role/update',
  Delete = '/role/delete',
  GetPersonalsByRole = '/userRole/listAuthUser',
  GetAuthPersonalsByRole = '/userRole/authUser',
}

export const getRoleListByPage = (params: RolePageParams) => {
  return defHttp.postForm<RolePageListGetResultModel>({ url:Api.Page, params });
};

export const getRoleList = (params: RolePageParams) => {
  return defHttp.post<RolePageListGetResultModel>({ url:Api.List, params });
};

export const getUserListByPage = (params: RolePageParams) => {
  return defHttp.postForm<RolePageListGetResultModel>({ url:Api.UserList, params });
};

// 通过角色id查询出授权用户
export const getPersonalsByRole = (params: PersonalByRoleParams) => {
  return defHttp.postForm<PersonalInfo>({ url: Api.GetPersonalsByRole, params });
};

/**
 * 给角色分配人员
 * @param params
 */
export const getPersonalsAuthByRole = (params: PersonalByRoleParams) => {
  return defHttp.post<PersonalInfo>({ url: Api.GetAuthPersonalsByRole, params });
};

export const getInfo = (id?: number | string) =>
  defHttp.get<RoleInfo>({ url: Api.RoleInfo + id});

export const saveInfo = (params?: RoleInfo) =>
  defHttp.post<RoleInfo>({ url: Api.Save, params });

export const updateInfo = (params?: RoleInfo) =>
  defHttp.put<RoleInfo>({url: Api.Update, params});

export const deleteByIds = (params?: DelByRoleParams) =>
  defHttp.deleteForm<RoleInfo>({ url: Api.Delete, params },{errorMessageMode:"modal"});