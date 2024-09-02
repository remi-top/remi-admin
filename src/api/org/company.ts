import {defHttp} from '/@/utils/http/axios';
import {listToTree, forEach} from "/@/utils/helper/treeHelper";
import {CompanyInfo, CompanyParams} from "/@/api/org/model/companyModel";
import {CheckExistParams} from "/@/api/model/baseModel";
import { CompanyLabelLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
enum Api {
  CompanyList = '/company/list',
  CompanyTree= '/company/tree',
  CompanyPage = '/company/page',
  CompanyInfo = '/company/',
  Save = '/company/add',
  Update = '/company/update',
  Delete = '/company/delete',
  CheckEntityExist = '/flow/org/company/checkEntityExist',
}

export const getCompanies = (params?: CompanyParams) => {
  const result = defHttp.post<CompanyInfo>({ url: Api.CompanyTree, params });
  return Promise.resolve(result).then(res => {
    let labelKey = CompanyLabelLocaleLang[getLocale.value]
    forEach(res, (node) => {
      if (node.children.length === 0) {
        delete node.children;
      }
      node.key = node.id;
      node.value = node.id;
      node.title = node[labelKey];
      node.companyName = node[labelKey];
      node.icon="clarity:organization-line"
    }, {id: 'id', children: 'children', pid: 'parentId'});
    return res;
  });
};

export const companyTree = (params?: CompanyParams) => {
  const result = defHttp.post<CompanyInfo>({url: Api.CompanyTree, params});
  return Promise.resolve(result).then(data => {
    // let res = treeToList(data, { id: 'id', children: 'children', pid: 'parentId' })
    // console.log(res,'res');
    
    // res.forEach(item=>{
    //   item.key = item.id;
    //   item.value = item.id;
    //   item.title = item.companyName;
    //   item.icon = 'bx:building-house';
      
    // });
    // const treeData = listToTree(res, {id: 'id', children: 'children', pid: 'parentId'});
    const treeData = data
    forEach(treeData, (node) => {
      if (node.children && node.children.length === 0) {
        delete node.children;
      }
      node.key = node.id;
      node.value = node.id;
      node.title = node.companyName;
      // node.icon = 'bx:building-house';

    }, {id: 'id', children: 'children', pid: 'parentId'});
    return treeData;
  });
};
export const getInfo = (id?: number | string) =>
  defHttp.get<CompanyInfo>({ url: Api.CompanyInfo + id});

export const saveInfo = (params?: CompanyInfo) =>
  defHttp.post<CompanyInfo>({ url: Api.Save, params });

export const updateInfo = (params?: CompanyInfo) =>
  defHttp.put<CompanyInfo>({url: Api.Update, params});

export const deleteByIds = (params?: Array<string>) =>
  defHttp.deleteForm<CompanyInfo>({url: Api.Delete, params},{errorMessageMode:"modal"});

export const checkEntityExist = (params?: CheckExistParams) =>
  defHttp.post<boolean>({ url: Api.CheckEntityExist, params });
