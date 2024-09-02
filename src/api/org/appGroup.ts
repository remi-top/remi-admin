import {defHttp} from '/@/utils/http/axios';
import { GroupInfo, GroupParams } from "./model/groupModel";
import {listToTree, forEach} from "/@/utils/helper/treeHelper";
import {CompanyInfo} from "/@/api/org/model/companyModel";
import { GroupLabelLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
enum Api {
  GetGroupTree = '/appGroup/tree',
  Update = '/appGroup/addOrUpdate',
}
export const getAppGroupTree = (params: GroupParams) => {
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

export const updateInfo = (params?: GroupInfo) =>
  defHttp.post<GroupInfo>({url: Api.Update, params});
