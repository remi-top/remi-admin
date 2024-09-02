import {defHttp} from '/@/utils/http/axios';
import {CheckExistParams} from "/@/api/model/baseModel";
import {JobGradeTypeInfo, JobGradeTypePageParams, JobGradeTypeParams} from "./model/jobGradeTypeModel";
import {forEach, listToTree} from "/@/utils/helper/treeHelper";

enum Api {
  GetJobGradeTypes = '/grade/list',
  SaveOrUpdate = '/flow/org/jobGradeType/saveOrUpdate',
  GradePage = '/grade/page',
  GradeInfo = '/grade/',
  Save = '/grade/add',
  Update = '/grade/update',
  Delete = '/grade/delete',
  CheckEntityExist = '/flow/org/jobGradeType/checkEntityExist',
}

export const getJobGradeTypes = (params: JobGradeTypeParams) => {
  const result = defHttp.post<JobGradeTypeInfo>({url: Api.GetJobGradeTypes, params});
  return result;
};

export const getJobGradeTypesToTree = (params?: JobGradeTypeParams) => {
  const result = defHttp.post<JobGradeTypeInfo>({url: Api.GetJobGradeTypes, params});
  return Promise.resolve(result).then(res => {
    res.forEach(item=>{
      item.key = item.id;
      item.value = item.id;
      item.title = item.gradeName;
    });
    return res
    const treeData = listToTree(res, {id: 'id', children: 'children', pid: 'id'});
    forEach(treeData, (node) => {
      if (node.children.length === 0) {
        delete node.children;
      }
    }, {id: 'id', children: 'children', pid: 'id'});
    return treeData;
  });
};

export const gradePage = (params?: JobGradeTypePageParams) =>
  defHttp.postForm<JobGradeTypePageParams>({ url: Api.GradePage, params});
  
export const getInfo = (id?: number | string) =>
  defHttp.get<CheckExistParams>({ url: Api.GradeInfo + id});

export const saveInfo = (params?: CheckExistParams) =>
  defHttp.post<CheckExistParams>({ url: Api.Save, params });

export const updateInfo = (params?: CheckExistParams) =>
  defHttp.put<CheckExistParams>({url: Api.Update, params});

export const deleteByIds = (params?: Array<string>) =>
  defHttp.deleteForm<CheckExistParams>({ url: Api.Delete, params },{errorMessageMode:"modal"});
  
export const checkEntityExist = (params?: CheckExistParams) =>
  defHttp.post<boolean>({ url: Api.CheckEntityExist, params });

