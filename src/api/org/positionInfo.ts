import {defHttp} from '/@/utils/http/axios';
import {BasicPageSearchParams, CheckExistParams} from "/@/api/model/baseModel";
import {
  PositionInfoParams,
  PositionInfo,
  PositionInfoPageListGetResultModel
} from "./model/positionInfoModel";
import { isArray } from '/@/utils/is';
import {forEach, listToTree} from "/@/utils/helper/treeHelper";
import { PositionLabelLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
enum Api {
  page = '/position/page',
  list = '/position/list',
  Info = '/position/',
  Save = '/position/add',
  Update = '/position/update',
  Delete = '/position/delete',
}

export const getPositionInfoList = (params?: PositionInfoParams) => {
  const result = defHttp.post<PositionInfoPageListGetResultModel>({url: Api.list, params});
  let labelKey = PositionLabelLocaleLang[getLocale.value]
  return Promise.resolve(result).then(res => {
    forEach(res, (node) => {
      node.positionName = node[labelKey]
    }, {id: 'id', children: 'children', pid: 'parentId'});
    return res;
  })
};

export const getPositionInfoPage = (params?: PositionInfoParams) => {
  const result = defHttp.postForm<PositionInfoPageListGetResultModel>({url: Api.page, params});
  let labelKey = PositionLabelLocaleLang[getLocale.value]
  return Promise.resolve(result).then(res => {
    if (res?.records && isArray(res.records)) {
      res.records.forEach(item=>{
        item.deptName = item[labelKey]
      });
    }
    return res;
  })
};

  export const getPostPage = (params: PositionInfoParams) => {
    const result = defHttp.postForm<PositionInfoPageListGetResultModel>({url: Api.page, params});
    return result;
  };

  export const getInfo = (id?: number | string) =>
  defHttp.get<PositionInfo>({ url: Api.Info + id});
  
  export const saveInfo = (params?: PositionInfoParams) =>
    defHttp.post<PositionInfo>({ url: Api.Save, params });
  
  export const updateInfo = (params?: PositionInfoParams) =>
    defHttp.put<PositionInfo>({url: Api.Update, params});
  
  export const deleteByIds = (params?: Array<string>) =>
    defHttp.deleteForm<PositionInfo>({url: Api.Delete, params},{errorMessageMode:"modal"});
