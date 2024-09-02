import {defHttp} from '/@/utils/http/axios';
import {listToTree, forEach} from "/@/utils/helper/treeHelper";
import {DeptInfo, DeptSearchParams} from "./model/deptModel";
import {CheckExistParams} from "/@/api/model/baseModel";
import { DeptLabelLocaleLang,DeptHeadNameLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
enum Api {
  DeptList = '/dept/list',
  DeptPage = '/dept/page',
  DeptTree = '/dept/tree',
  DeptInfo = '/dept/',
  GetOrgTree = '/flow/org/department/getOrgTree',
  Save = '/dept/add',
  Update = '/dept/update',
  Delete = '/dept/delete',
  GetAuthRoleByDept = '/dept/getAuthRoleByDept',
  AuthDept = '/dept/authDept',
  CancelAuthDept = '/dept/cancelAuthDept',
  CheckEntityExist = '/flow/org/department/checkEntityExist',
}

export const getDeptsTree = (params?: DeptSearchParams) => {
  const result = defHttp.post<DeptInfo>({url: Api.DeptTree, params});
  let labelKey = DeptHeadNameLocaleLang[getLocale.value]
  return Promise.resolve(result).then(data => {
    const treeData = data
    forEach(treeData, (node) => {
      if (node.children && node.children.length === 0) {
        delete node.children;
      }
      node.key = node.id;
      node.value = node.id;
      node.title = node.deptName;
      node.deptHeadName = node[labelKey]
      node.icon = 'ant-design:user-outlined'
    }, {id: 'id', children: 'children', pid: 'parentId'});
    return treeData;
  });
};
export const getDeptsTreeLeft = (params?: DeptSearchParams) => {
  const result = defHttp.post<DeptInfo>({url: Api.DeptTree, params});
  return Promise.resolve(result).then(data => {
    let labelKey = DeptLabelLocaleLang[getLocale.value]
    const treeData = data
    forEach(treeData, (node) => {
      if (node.children && node.children.length === 0) {
        delete node.children;
        node.isLeaf = true
      } else {
        node.isLeaf = false
      }
      node.key = node.id;
      node.value = node.id;
      node.title = node[labelKey];
      node.deptName = node[labelKey];
      node.icon = 'ant-design:user-outlined'
      // node.icon = 'bx:building-house';
    }, {id: 'id', children: 'children', pid: 'parentId'});
    return treeData;
  });
};

export const getOrgTree = () => {
  const result = defHttp.get<DeptInfo>({url: Api.GetOrgTree});
  return Promise.resolve(result).then((res:any) => {
    res.forEach(item=>{
      item.key = item.id;
      item.value = item.id;
      item.title = item.shortName;
      if (item.sourceType == 1) {
        // item.icon = 'bx:building-house';
      } else if (item.sourceType == 2) {
        // item.icon = 'ant-design:cluster-outlined';
      }
    });
    const treeData = listToTree(res, {id: 'id', children: 'children', pid: 'pid'});
    forEach(treeData, (node) => {
      if (node.children.length === 0) {
        delete node.children;
      }
    }, {id: 'id', children: 'children', pid: 'pid'});
    return treeData;
  });
};
export const getDeptPage = (params?: DeptSearchParams) =>
  defHttp.postForm<DeptInfo>({ url: Api.DeptPage,params });
  
export const getInfo = (id?: number | string) => {
  const result = defHttp.get<DeptInfo>({ url: Api.DeptInfo + id});
  return Promise.resolve(result).then((res: any) => {
    let labelKey = DeptHeadNameLocaleLang[getLocale.value]
    res.deptHeadName = res[labelKey]
    return res;
  });
}
  

export const saveInfo = (params?: DeptInfo) =>
  defHttp.post<DeptInfo>({ url: Api.Save, params });

export const updateInfo = (params?: DeptInfo) =>
  defHttp.put<DeptInfo>({url: Api.Update, params});

export const deleteByIds = (params?: Array<string>) =>
  defHttp.deleteForm<DeptInfo>({url: Api.Delete, params},{errorMessageMode:"modal"});

export const checkEntityExist = (params?: CheckExistParams) =>
  defHttp.post<boolean>({ url: Api.CheckEntityExist, params });

export const GetAuthRoleByDept = (params?: CheckExistParams) =>
  defHttp.post<boolean>({ url: Api.GetAuthRoleByDept, params });

export const AuthDept = (params?: CheckExistParams) =>
  defHttp.post<boolean>({ url: Api.AuthDept, params });

export const CancelAuthDept = (params?: CheckExistParams) =>
  defHttp.post<boolean>({ url: Api.CancelAuthDept, params });


