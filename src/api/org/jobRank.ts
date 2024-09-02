import {defHttp} from '/@/utils/http/axios';
import {BatchJobRankVo, JobRankInfo, JobRankParams} from "./model/jobRankModel";
import {listToTree, forEach} from "/@/utils/helper/treeHelper";
import {CompanyInfo} from "/@/api/org/model/companyModel";
import { RankLabelLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
enum Api {
  GetJobRanks = '/rank/page',
  GetJobRankList = '/rank/list',
  Info = '/rank/',
  Save = '/rank/add',
  Update = '/rank/update',
  Delete = '/rank/delete',
}

export const getJobRanks = (params: JobRankParams) => {
  const result = defHttp.post<JobRankInfo[]>({url: Api.GetJobRankList, params});
  return result;
};
export const getJobRankList = (params: JobRankParams) => {
  const result = defHttp.post<JobRankInfo[]>({url: Api.GetJobRankList, params});
  let labelKey = RankLabelLocaleLang[getLocale.value]
  return Promise.resolve(result).then(res => {
    const r = res
    forEach(r, (node) => {
      node.key = node.id;
      node.value = node.id;
      node.title = node[labelKey]+'-'+node.rankCode;
      node.icon = null
    }, {id: 'id', children: 'children', pid: 'parentId'});
    return r;
  })
};

export const deleteById = (params?: Array<string>) =>
  defHttp.post<JobRankInfo>({ url: Api.Delete, params });
  
export const getInfo = (id?: number | string) =>
defHttp.get<CompanyInfo>({ url: Api.Info + id});

export const saveInfo = (params?: CompanyInfo) =>
  defHttp.post<CompanyInfo>({ url: Api.Save, params });

export const updateInfo = (params?: CompanyInfo) =>
  defHttp.put<CompanyInfo>({url: Api.Update, params});

export const deleteByIds = (params?: Array<string>) =>
  defHttp.deleteForm<CompanyInfo>({url: Api.Delete, params},{errorMessageMode:"modal"});
