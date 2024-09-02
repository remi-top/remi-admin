import {defHttp} from '/@/utils/http/axios';
import { DictItemInfo, DictItemParams} from "./dictItemModel";
enum Api {
  Page = '/dictItem/page',
  List = '/dictItem/list',
  Info = '/dictItem/',
  Save = '/dictItem/add',
  Update = '/dictItem/update',
  Delete = '/dictItem/delete',
}

export const getDictItemPage = (params: DictItemParams) => {
  const result = defHttp.postForm<DictItemInfo[]>({url: Api.Page, params});
  return result;
};
export const deleteById = (params?: Array<string>) =>
  defHttp.post<DictItemInfo>({ url: Api.Delete, params });
  
export const getInfo = (id?: number | string) =>
defHttp.get<DictItemInfo>({ url: Api.Info + id});

export const saveInfo = (params?: DictItemInfo) =>
  defHttp.post<DictItemInfo>({ url: Api.Save, params });

export const updateInfo = (params?: DictItemInfo) =>
  defHttp.put<DictItemInfo>({url: Api.Update, params});

export const deleteByIds = (params?: Array<string>) =>
  defHttp.deleteForm<DictItemInfo>({url: Api.Delete, params},{errorMessageMode:"modal"});