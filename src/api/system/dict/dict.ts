import {defHttp} from '/@/utils/http/axios';
import { DictInfo, DictParams} from "./dictModel";
enum Api {
  Page = '/dict/page',
  List = '/dict/list',
  Info = '/dict/',
  Save = '/dict/add',
  Update = '/dict/update',
  Delete = '/dict/delete',
}

export const getDictPage = (params: DictParams) => {
  const result = defHttp.postForm<DictInfo[]>({url: Api.Page, params});
  return result;
};
export const deleteById = (params?: Array<string>) =>
  defHttp.post<DictInfo>({ url: Api.Delete, params });
  
export const getInfo = (id?: number | string) =>
defHttp.get<DictInfo>({ url: Api.Info + id});

export const saveInfo = (params?: DictInfo) =>
  defHttp.post<DictInfo>({ url: Api.Save, params });

export const updateInfo = (params?: DictInfo) =>
  defHttp.put<DictInfo>({url: Api.Update, params});

export const deleteByIds = (params?: Array<string>) =>
  defHttp.deleteForm<DictInfo>({url: Api.Delete, params},{errorMessageMode:"modal"});