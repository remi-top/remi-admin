import { defHttp } from '/@/utils/http/axios';
import { getMenuListByIdParams, getMenuListByIdParamsResultModel, ModuleInfo } from './model/menuModel';
import { getUserInfo } from './user'
import { GetUserInfoModel } from './model/userModel';
import { concat } from 'lodash-es'
import menu from './menu.json'
import ams from './ams-menu.json'
import mps from './mps-menu.json'
import ids from './ids-menu.json'
import { eachTree, filter} from '/@/utils/helper/treeHelper';
import { useGlobSetting } from '/@/hooks/setting';
const globSetting = useGlobSetting();
const appCode = globSetting.appCode
import { MenuLocaleLang } from '/@/enums/appEnum';
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
import { useUserStoreWithOut } from '/@/store/modules/user';
enum Api {
  // 测试先屏蔽
  // GetLoginModules = './menu.json'
  GetUserInfo = '/user/token/',
  GetLoginModules = '/common/getUserMenuInfo'
}

/**
 * @description: Get user menu based on id
 */

// export const getMenuList = () => {
//   // return data
//   // const result = defHttp.post<ModuleInfo>({ url: Api.GetLoginModules});
//   // return Promise.resolve(result).then(res => {
//     let res = concat(menu.data,
//       ids.data,
//       ams.data,
//       mps.data,
//     )
//     let list = []
//     let menuNameKey = MenuLocaleLang[getLocale.value]
//     list = res.map(item => {
//       return {
//         sn:item.menuCode,
//         url:item.menuPath,
//         name:item[menuNameKey],
//         image:item.menuIcon,
//         showStatus:item.visible,
//         component:item.menuComponent,
//         ...item
//       }
//     })
//     return list;
//   // });
//   // return defHttp.get<getMenuListByIdParamsResultModel>({ url: Api.GetLoginModules });
// };
export const getMenuList = getUserInfo

/**
 * @description: Get user menu based on id
 */

export const getLoginModules = (params: getMenuListByIdParams) => {
  return defHttp.get<ModuleInfo>({ url: Api.GetLoginModules, params });
};
