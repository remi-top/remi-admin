import {defHttp} from '/@/utils/http/axios';
import { NoticeInfo, NoticeParams} from "./noticeModel";
enum Api {
  Page = '/notice/page',
  List = '/notice/list',
  Info = '/notice/',
  Save = '/notice/add',
  Update = '/notice/update',
  Delete = '/notice/delete',
}

export const getNoticePage = (params: NoticeParams) => {
  // return data;
  const result = defHttp.postForm<NoticeInfo[]>({url: Api.Page, params});
  return Promise.resolve(result).then(res => {
    return res;
  })
};
export const deleteById = (params?: Array<string>) =>
  defHttp.post<NoticeInfo>({ url: Api.Delete, params });
  
export const getInfo = (id?: number | string) => {

  const result = defHttp.get<NoticeInfo>({ url: Api.Info+id, params:{
    id
  }});
  // return result
  // const result = data1
  return Promise.resolve(result).then(res => {
    return res;
  })
}

export const saveInfo = (params?: NoticeInfo) =>
  defHttp.post<NoticeInfo>({ url: Api.Save, params });

export const updateInfo = (params?: NoticeInfo) =>
  defHttp.put<NoticeInfo>({url: Api.Update, params});

export const deleteByIds = (params?: Array<string>) =>
  defHttp.deleteForm<NoticeInfo>({url: Api.Delete, params},{errorMessageMode:"modal"});