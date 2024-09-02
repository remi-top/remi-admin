import {
  RolePageParams,
  RoleInfo,
  RolePageListGetResultModel
} from '../org/model/roleModel';
import {defHttp} from '/@/utils/http/axios';

enum Api {
  PageList = '/cordRole/page',
  UserList = '/cordRole/page',
  RoleInfo = '/cordRole/',
  Save = '/cordRole/add',
  Update = '/cordRole/update',
  Delete = '/cordRole/delete',
}

export const getCordRoleListByPage = (params: RolePageParams) => {
  return defHttp.postForm<RolePageListGetResultModel>({ url:Api.PageList, params });
};

export const getUserListByPage = (params: RolePageParams) => {
  return defHttp.postForm<RolePageListGetResultModel>({ url:Api.UserList, params });
};
export const getInfo = (id?: number | string) =>
  defHttp.get<RoleInfo>({ url: Api.RoleInfo + id});

export const saveInfo = (params?: RoleInfo) =>
  defHttp.post<RoleInfo>({ url: Api.Save, params });

export const updateInfo = (params?: RoleInfo) =>
  defHttp.put<RoleInfo>({url: Api.Update, params});

export const deleteByIds = (params?: RoleInfo) =>
  defHttp.deleteForm<RoleInfo>({ url: Api.Delete, params },{errorMessageMode:"modal"});