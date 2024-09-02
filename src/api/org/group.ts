import {defHttp} from '/@/utils/http/axios';
import { GroupInfo, GroupParams } from "./model/groupModel";
import {listToTree, forEach} from "/@/utils/helper/treeHelper";
import {CompanyInfo} from "/@/api/org/model/companyModel";
import { GroupLabelLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
enum Api {
  GetGroups = '/group/page',
  GetGroupList = '/group/list',
  GetGroupTree = '/group/tree',
  Info = '/group/',
  Save = '/group/add',
  Update = '/group/update',
  Delete = '/group/delete',
}

export const getGroups = (params: GroupParams) => {
  const result = defHttp.postForm<GroupInfo[]>({url: Api.GetGroups, params});
  return result;
};
export const getGroupList = (params: GroupParams) => {
  const result = defHttp.post<GroupInfo[]>({url: Api.GetGroupList, params});
  let labelKey = GroupLabelLocaleLang[getLocale.value]
  return Promise.resolve(result).then(res => {
    const r = res
    forEach(r, (node) => {
      node.key = node.id;
      node.value = node.id;
      node.title = node[labelKey]
      node.isLeaf = true
      node.icon = 'clarity:group-line'
    }, {id: 'id', children: 'children', pid: 'parentId'});
    return r;
  })
};

export const getGroupTree = (params: GroupParams) => {
  const result = defHttp.post<GroupInfo[]>({url: Api.GetGroupTree, params});
  let labelKey = GroupLabelLocaleLang[getLocale.value]
  return Promise.resolve(result).then((res:any) => {
    forEach(res, (node) => {
      node.key = node.id;
      node.value = node.id;
      node.title = node[labelKey]
      if (node.children.length === 0) {
        delete node.children;
      }
    }, {id: 'id', children: 'children', pid: 'parentId'});
    return res;
  });
};

export const deleteById = (params?: Array<string>) =>
  defHttp.post<GroupInfo>({ url: Api.Delete, params });
  
export const getInfo = (id?: number | string) =>
defHttp.get<GroupInfo>({ url: Api.Info + id});

export const saveInfo = (params?: GroupInfo) =>
  defHttp.post<GroupInfo>({ url: Api.Save, params });

export const updateInfo = (params?: GroupInfo) =>
  defHttp.put<GroupInfo>({url: Api.Update, params});

export const deleteByIds = (params?: Array<string>) =>
  defHttp.deleteForm<GroupInfo>({url: Api.Delete, params},{errorMessageMode:"modal"});
