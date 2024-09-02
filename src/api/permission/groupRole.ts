import {
  RolePageParams,
  RoleInfo,
  RolePageListGetResultModel
} from '../org/model/roleModel';
import {defHttp} from '/@/utils/http/axios';

enum Api {
  PageList = '/groupRole/page',
  UserList = '/groupRole/page',
  RoleInfo = '/groupRole/',
  Save = '/groupRole/add',
  Update = '/groupRole/update',
  Delete = '/groupRole/delete',
  AddOrUpdate = '/groupRole/add',
}

export const getGroupRoleListByPage = (params: RolePageParams) => {
  return defHttp.postForm<RolePageListGetResultModel>({ url:Api.PageList, params });
};

export const getGroupRole= (params: RolePageParams) => {
  return defHttp.postForm<RolePageListGetResultModel>({ url:Api.UserList, params });
};
export const getInfo = (id?: number | string) =>
  defHttp.get<RoleInfo>({ url: Api.RoleInfo + id});

export const saveInfo = (params?: RoleInfo[]) =>
  defHttp.post<RoleInfo>({ url: Api.AddOrUpdate, params });

export const updateInfo = (params?: RoleInfo) =>
  defHttp.put<RoleInfo>({url: Api.Update, params});

export const deleteByIds = (params?: RoleInfo) =>
  defHttp.deleteForm<RoleInfo>({ url: Api.Delete, params },{errorMessageMode:"modal"});