import {defHttp} from '/@/utils/http/axios';
import { UserGroupInfo, UserGroupParams } from "./model/userGroupModel";
import {listToTree, forEach} from "/@/utils/helper/treeHelper";
import {CompanyInfo} from "/@/api/org/model/companyModel";
import { GroupLabelLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
enum Api {
  GetUserGroups = '/groupUser/page',
  GetUserGroupList = '/groupUser/list',
  Info = '/groupUser/',
  Save = '/groupUser/add',
  Update = '/groupUser/update',
  Delete = '/groupUser/delete',
}

export const getUserGroupPage = (params: UserGroupParams) => {
  const result = defHttp.postForm<UserGroupInfo[]>({url: Api.GetUserGroups, params});
  return result;
};
export const getUserGroupList = (params: UserGroupParams) => {
  const result = defHttp.post<UserGroupInfo[]>({url: Api.GetUserGroupList, params});
  let labelKey = GroupLabelLocaleLang[getLocale.value]
  return Promise.resolve(result).then(res => {
    const r = res
    forEach(r, (node) => {
      node.key = node.id;
      node.value = node.id;
      node.title = node[labelKey]
      node.isLeaf = true
    }, {id: 'id', children: 'children', pid: 'parentId'});
    return r;
  })
};

export const deleteById = (params?: Array<string>) =>
  defHttp.post<UserGroupInfo>({ url: Api.Delete, params });
  
export const getInfo = (id?: number | string) =>
defHttp.get<CompanyInfo>({ url: Api.Info + id});

export const saveInfo = (params?: CompanyInfo) =>
  defHttp.post<CompanyInfo>({ url: Api.Save, params });

export const updateInfo = (params?: CompanyInfo) =>
  defHttp.put<CompanyInfo>({url: Api.Update, params});

export const deleteByIds = (params?: Array<string>) =>
  defHttp.deleteForm<CompanyInfo>({url: Api.Delete, params},{errorMessageMode:"modal"});
