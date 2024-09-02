import {defHttp} from '/@/utils/http/axios';
import { ConfigRecordInfo, ConfigRecordParams} from "./configModel";
enum Api {
  Page = '/config/page',
  List = '/config/list',
  Info = '/config/get',
  Save = '/config/add',
  Update = '/config/operate',
  Delete = '/config/delete',
}

export const getConfigRecordPage = (params: ConfigRecordParams) => {
  const result = defHttp.postForm<ConfigRecordInfo[]>({url: Api.Page, params});
  // return result;
  // const result = data
  return Promise.resolve(result).then(res => {
    return res;
  })
};
export const deleteById = (params?: Array<string>) =>
  defHttp.post<ConfigRecordInfo>({ url: Api.Delete, params });
  
export const getInfo = (id?: number | string) => {
  const result = defHttp.get<ConfigRecordInfo>({ url: Api.Info, params:{
    id
  }});
  // return result
  // const result = data1
  return Promise.resolve(result).then(res => {
    return res;
  })
}

export const saveInfo = (params?: ConfigRecordInfo) =>
  defHttp.post<ConfigRecordInfo>({ url: Api.Save, params });

export const updateInfo = (params?: ConfigRecordInfo[]) =>
  defHttp.post<ConfigRecordInfo>({url: Api.Update, params});

export const deleteByIds = (params?: Array<string>) =>
  defHttp.deleteForm<ConfigRecordInfo>({url: Api.Delete, params},{errorMessageMode:"modal"});