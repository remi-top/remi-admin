import {defHttp} from '/@/utils/http/axios';
import { AppInfo, AppParams} from "./appModel";
import { forEach } from "/@/utils/helper/treeHelper";
import { AppNameLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
import { data } from './app.json'
const { getLocale } = useLocale();
enum Api {
  Page = '/app/page',
  List = '/app/list',
  Info = '/app/',
  Save = '/app/add',
  Update = '/app/update',
  Delete = '/app/delete',
}


export const getAppPage = (params: AppParams) => {
  // console.log('paramsparams',params)
  const result = defHttp.post<AppInfo[]>({url: Api.List, params});
  // const result = data
  let labelKey = AppNameLocaleLang[getLocale.value]
  return Promise.resolve(result).then(res => {
    const r = res
    forEach(r, (node) => {
      node.appName = node[labelKey]
    }, {id: 'id', children: 'children', pid: 'parentId'});
    return r;
  })
  return result;
};

export const getAppList = (params: AppInfo) => {
  const result = defHttp.post<AppInfo[]>({url: Api.List, params});
  let labelKey = AppNameLocaleLang[getLocale.value]
  return Promise.resolve(result).then(res => {
    const r = res
    forEach(r, (node) => {
      node.key = node.id;
      node.value = node.id;
      node.title = node[labelKey]
      node.isLeaf = true
      node.icon = 'icon-park-outline:all-application'
    }, {id: 'id', children: 'children', pid: 'parentId'});
    return r;
  })
};
export const deleteById = (params?: Array<string>) =>
  defHttp.post<AppInfo>({ url: Api.Delete, params });
  
export const getInfo = (id?: number | string) =>
defHttp.get<AppInfo>({ url: Api.Info + id});

export const saveInfo = (params?: AppInfo) =>
  defHttp.post<AppInfo>({ url: Api.Save, params });

export const updateInfo = (params?: AppInfo) =>
  defHttp.put<AppInfo>({url: Api.Update, params});

export const deleteByIds = (params?: Array<string>) =>
  defHttp.deleteForm<AppInfo>({url: Api.Delete, params},{errorMessageMode:"modal"});