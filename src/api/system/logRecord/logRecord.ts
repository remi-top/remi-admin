import {defHttp} from '/@/utils/http/axios';
import { LogRecordInfo, LogRecordParams} from "./logRecordModel";
enum Api {
  PageLogin = '/logRecord/pageLogin',
  PageOperate = '/logRecord/pageOperate',
  PageException = '/logRecord/pageException',
  List = '/logRecord/list',
  Info = '/logRecord/get',
  Save = '/logRecord/add',
  Update = '/logRecord/update',
  Delete = '/logRecord/delete',
}
import data from './1.json'
import data1 from './2.json'

export const getLogRecordPage = (params: LogRecordParams) => {
  const result = defHttp.postForm<LogRecordInfo[]>({url: Api.PageOperate, params});
  // return result;
  // const result = data
  return Promise.resolve(result).then(res => {
    return res;
  })
};
export const getPageLogin= (params: LogRecordParams) => {
  const result = defHttp.postForm<LogRecordInfo[]>({url: Api.PageLogin, params});
  // return result;
  // const result = data
  return Promise.resolve(result).then(res => {
    return res;
  })
};
export const getPageException = (params: LogRecordParams) => {
  const result = defHttp.postForm<LogRecordInfo[]>({url: Api.PageException, params});
  // return result;
  // const result = data
  return Promise.resolve(result).then(res => {
    return res;
  })
};
export const deleteById = (params?: Array<string>) =>
  defHttp.post<LogRecordInfo>({ url: Api.Delete, params });
  
export const getInfo = (id?: number | string) => {

  const result = defHttp.get<LogRecordInfo>({ url: Api.Info, params:{
    id
  }});
  // return result
  // const result = data1
  return Promise.resolve(result).then(res => {
    return res;
  })
}

export const saveInfo = (params?: LogRecordInfo) =>
  defHttp.post<LogRecordInfo>({ url: Api.Save, params });

export const updateInfo = (params?: LogRecordInfo) =>
  defHttp.put<LogRecordInfo>({url: Api.Update, params});

export const deleteByIds = (params?: Array<string>) =>
  defHttp.deleteForm<LogRecordInfo>({url: Api.Delete, params},{errorMessageMode:"modal"});