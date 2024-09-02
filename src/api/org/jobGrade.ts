import {defHttp} from '/@/utils/http/axios';
import {BatchJobGradeVo, JobGradeInfo, JobGradeParams} from "./model/jobGradeModel";
import {listToTree, forEach} from "/@/utils/helper/treeHelper";
import {CompanyInfo} from "/@/api/org/model/companyModel";
import { GradeLabelLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
enum Api {
  GetJobGrades = '/grade/page',
  GetJobGradeList = '/grade/list',
  Info = '/grade/',
  Save = '/grade/add',
  Update = '/grade/update',
  Delete = '/grade/delete',
}

export const getJobGrades = (params: JobGradeParams) => {
  const result = defHttp.postForm<JobGradeInfo[]>({url: Api.GetJobGrades, params});
  return result;
};
export const getJobGradeList = (params: JobGradeParams) => {
  const result = defHttp.post<JobGradeInfo[]>({url: Api.GetJobGradeList, params});
  let labelKey = GradeLabelLocaleLang[getLocale.value]
  return Promise.resolve(result).then(res => {
    const r = res
    forEach(r, (node) => {
      node.key = node.id;
      node.value = node.id;
      node.title = node[labelKey]
      node.isLeaf = true
      node.icon = 'hugeicons:job-search'
    }, {id: 'id', children: 'children', pid: 'parentId'});
    return r;
  })
};

export const deleteById = (params?: Array<string>) =>
  defHttp.post<JobGradeInfo>({ url: Api.Delete, params });
  
export const getInfo = (id?: number | string) =>
defHttp.get<CompanyInfo>({ url: Api.Info + id});

export const saveInfo = (params?: CompanyInfo) =>
  defHttp.post<CompanyInfo>({ url: Api.Save, params });

export const updateInfo = (params?: CompanyInfo) =>
  defHttp.put<CompanyInfo>({url: Api.Update, params});

export const deleteByIds = (params?: Array<string>) =>
  defHttp.deleteForm<CompanyInfo>({url: Api.Delete, params},{errorMessageMode:"modal"});
