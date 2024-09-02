import {defHttp} from '/@/utils/http/axios';
import {AclInfo, ModuleParam,AclSaveByGroupModuleParam, AclSaveByModuleParam} from "/@/api/privilege/model/aclModel";
import {ModuleInfo} from "/@/api/privilege/model/moduleModel";
import {forEach, listToTree} from "/@/utils/helper/treeHelper";
import { data } from './data1.json'

enum Api {
  SetAcl = '/flow/privilege/acl/setAcl',
  listAuthMenu = '/roleMenu/list',
  AddOrUpdate = '/roleMenu/addOrUpdate',
  SetAllAcl = '/flow/privilege/acl/setAllAcl',
  SetAclModuleList = '/flow/privilege/acl/setAclModuleList',
  SetAclByModule = '/flow/privilege/acl/setAclByModule',
}

// 获取该角色所有的菜单
export const getModuleAclsByGroupId = (params: any) =>
{
  const result = defHttp.post<ModuleInfo>({ url: Api.listAuthMenu,params});
  // const result = data
  return Promise.resolve(result).then((res: any) => {
    if (!res) {
      return []
    }
    const treeData = listToTree(res, {id:'id', children:'children', pid:'pid'});
    forEach(treeData, (node) => {
      if(node.children.length===0){
        delete node.children;
      }
    }, {id:'id', children:'children', pid:'pid'});
    return treeData;
  });
};
// 角色批量授权菜单
export const authMenu = (params: ModuleParam) =>
  defHttp.post<ModuleInfo>({ url: Api.AddOrUpdate,params});
  
export const setAcl = (params: AclSaveByModuleParam) =>
  defHttp.post<AclInfo>({url: Api.SetAcl+'/'+params.position+'/'+params.checked, params: params.aclInfo});

export const setAllAcl = (params: AclSaveByModuleParam) =>
  defHttp.post<AclInfo>({url: Api.SetAllAcl+`/${params.checked}`, params: params.aclInfo});

export const setAclByModule = (params: AclSaveByModuleParam) =>
  defHttp.post<AclInfo>({url: Api.SetAclByModule+'/'+params.checked, params: params.aclInfo});

export const setAclModuleList = (params: AclSaveByGroupModuleParam) =>
  defHttp.post<AclInfo>({url: Api.SetAclModuleList+`/${params.moduleId}/${params.groupId}`, params: params.aclList});
