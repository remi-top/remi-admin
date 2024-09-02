import { ModuleParams, ModuleInfo, AppInfo } from './model/moduleModel';

import { defHttp } from '/@/utils/http/axios';
import { listToTree, eachTree,forEach } from '/@/utils/helper/treeHelper';
import { useLocale } from '/@/locales/useLocale';
import { AppNameLocaleLang  } from '/@/enums/appEnum'
import { data } from './data.json'
const { getLocale } = useLocale();
enum Api {
  CompanyPage = '/company/page',
  MenuTree = '/menu/tree',
  MenuList = '/menu/list',
  GetAppCodeMenuList = '/appMenu/tree',
  MenuInfo = '/menu/',
  Save = '/menu/add',
  Update = '/menu/update',
  Delete = '/menu/delete',
  AppInfoList = '/appInfo/list',
}

export const getModules = (params?: ModuleParams) => {
  // TODO
  // if (!params.appCode) {
  //   return false;
  // }
  const result = defHttp.post<ModuleInfo>({ url: Api.MenuTree, params });
  return Promise.resolve(result).then((res: any) => {
    const treeData = listToTree(res, { id: 'id', children: 'children', pid: 'parentId' });
    forEach(
      treeData,
      (node) => {
        if (node.children.length === 0) {
          delete node.children;
        }
      },
      { id: 'id', children: 'children', pid: 'parentId' },
    );
    return treeData;
  });
};

export const getModulesList = (params?: ModuleParams) => {
  const result = defHttp.post<ModuleInfo>({ url: Api.GetAppCodeMenuList, params });
  // const result = data
  return Promise.resolve(result).then((res: any) => {
    let menuList = [];
    let appNameKey = AppNameLocaleLang[getLocale.value]
    menuList = res.map((item) => {
      const treeData = item.menuTree;
      const expandedKeys = [];
      // treeData.map((i) => {
      //   if (i.children) {
      //     expandedKeys.push(i.id);
      //   }
      // });
      forEach(treeData, (node) => {
        // if (node.children && node.children.length) {
        //   expandedKeys.push(node.id);
        // }
        // if ((!node.children || !node.children.length)) {
        //   node.class = 'line_leaf'
        // }
        if (node.menuType == 3) {
          node.class = 'line_leaf'
        }
      }, {id:'id', children:'children', pid:'pid'});
      return {
        // appName: item[appNameKey],
        // appName: item.appCode,
        // appCode: item.appCode,
        // authMenus: [],
        expandedKeys,
        id:item.appId,
        menuName:item.appName,
        menuNameEn:item.appNameEn,
        children:treeData,
      };
    });
    return menuList;
  });
};

export const getAppIconList = (params?: ModuleParams) => {
  const result = defHttp.post<AppInfo>({ url: Api.AppInfoList, params });
  return Promise.resolve(result).then((res) => {
    let appNameKey = AppNameLocaleLang[getLocale.value]
    res.forEach((item) => {
      // item.key = item.id;
      // item.value = item.id;
      // item.label = item.appName;
      // item.title = item.appName;
      item.appName = item[appNameKey]
      item.icon = 'bx:building-house';
    });
    const treeData = listToTree(res, { id: 'appCode', children: 'children', pid: 'parentId' });
    forEach(
      treeData,
      (node) => {
        if (node.children.length === 0) {
          delete node.children;
        }
      },
      { id: 'appCode', children: 'children', pid: 'parentId' },
    );
    return treeData;
  });
};

export const getInfo = (id?: number | string) => defHttp.get<AppInfo>({ url: Api.MenuInfo + id });

export const saveInfo = (params?: AppInfo) => defHttp.post<AppInfo>({ url: Api.Save, params });

export const updateInfo = (params?: AppInfo) => defHttp.put<AppInfo>({ url: Api.Update, params });

export const deleteByIds = (params?: Array<string>) =>
  defHttp.deleteForm<AppInfo>({ url: Api.Delete, params }, { errorMessageMode: 'modal' });
