import { defHttp } from '/@/utils/http/axios';
import { getMenuListByIdParams, getMenuListByIdParamsResultModel,ModuleInfoObj, ModuleInfo } from './model/menuModel';
import { concat } from 'lodash-es'
import menu from './menu.json'
import ams from './ams-menu.json'
import mps from './mps-menu.json'
import ids from './ids-menu.json'
import {data} from './menu.json'
import { useGlobSetting } from '/@/hooks/setting';
import { listToTree,eachTree,filter ,findNode} from '/@/utils/helper/treeHelper';
const globSetting = useGlobSetting();
const appCode = globSetting.appCode
import { MenuLocaleLang } from '/@/enums/appEnum';
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
import { useUserStoreWithOut } from '/@/store/modules/user';
enum Api {
  // 测试先屏蔽
  // GetLoginModules = './menu.json'
  GetLoginModules = '/user/token/',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  // return data/
  const userStore = useUserStoreWithOut();
  const token = userStore.getToken
  // const result = defHttp.post<ModuleInfoObj>({ url: Api.GetLoginModules+token});
  const result:ModuleInfoObj = data
  return Promise.resolve(result).then(data => {
    let res = data.userMenus ? data.userMenus : []
    // let res = concat(menu.data,
    //   ids.data,
    //   ams.data,
    //   mps.data,
    // )
    let list = res.find(i => i.appCode == appCode)?.menuTree
    let menuNameKey = MenuLocaleLang[getLocale.value]
    let permissionCodeList:ModuleInfo[] = []
    eachTree(list, (item, _parent) => {
      item.sn = item.menuCode;
      item.url = item.menuPath;
      item.name = item[menuNameKey];
      item.image = item.menuIcon;
      item.showStatus = item.visible;
      item.component = item.menuComponent;
      if(item.menuType === 3){
        permissionCodeList.push(item)
      }
      return item
    },{
      id: 'id',
      children: 'children',
      pid: 'parentId'
    })
    console.log(list,'list')
    console.log(appCode,'appCode')
    let routeList = filter(
      list,
      (item)=>{return item.menuType != 3},
      {
        id: 'id',
        children: 'children',
        pid: 'parentId'
      }
    )
    // list = res.map(item => {
    //   return {
    //     sn:item.menuCode,
    //     url:item.menuPath,
    //     name:item[menuNameKey],
    //     image:item.menuIcon,
    //     showStatus:item.visible,
    //     component:item.menuComponent,
    //     ...item
    //   }
    // })
    return {
      routeList,
      permissionCodeList
    };
  });
  // return defHttp.get<getMenuListByIdParamsResultModel>({ url: Api.GetLoginModules });
};

/**
 * @description: Get user menu based on id
 */

export const getLoginModules = (params: getMenuListByIdParams) => {
  return defHttp.get<ModuleInfo>({ url: Api.GetLoginModules, params });
};
