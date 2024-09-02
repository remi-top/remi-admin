import { defHttp } from '/@/utils/http/axios';
import {listToTree, forEach} from "/@/utils/helper/treeHelper";
import {
  PersonalListGetResultModel,
  PersonalPageParams,
  PersonalParams,
  DelByIdParams,
  PersonalInfo
} from "./model/personalModel";
import { DeptLabelLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
import { isArray } from '/@/utils/is';
const { getLocale } = useLocale();
enum Api {
  PersonalPageList = '/user/page',
  Info = '/user/',
  Save = '/user/add',
  Update = '/user/update',
  Delete = '/user/delete',
}

export const getPersonalPageList = (params: PersonalPageParams) => {
  const result = defHttp.postForm<PersonalListGetResultModel>({ url:Api.PersonalPageList,  params });
  return Promise.resolve(result).then(data => { 
    let labelKey = DeptLabelLocaleLang[getLocale.value]
    if (data?.records && isArray(data.records)) {
      data.records.forEach(item=>{
        item.deptName = item[labelKey]
      });
    }
    return data
  })
}

export const getInfo = (id?: number | string) =>
defHttp.get<PersonalInfo>({ url: Api.Info + id});

export const saveInfo = (params?: PersonalParams) =>
  defHttp.post<PersonalListGetResultModel>({ url: Api.Save, params });

export const updateInfo = (params?: PersonalInfo) =>
  defHttp.put<PersonalListGetResultModel>({ url: Api.Update, params });
  
export const deleteByIds = (params?: DelByIdParams) =>
  defHttp.deleteForm({url: Api.Delete, params},{errorMessageMode:"modal"});

