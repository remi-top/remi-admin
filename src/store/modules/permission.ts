import type { AppRouteRecordRaw, Menu } from '/@/router/types';

import { defineStore } from 'pinia';
import { store } from '/@/store';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStore } from './user';
import { useAppStoreWithOut } from './app';
import { toRaw } from 'vue';
import { transformObjToRoute, flatMultiLevelRoutes } from '/@/router/helper/routeHelper';
import { transformRouteToMenu } from '/@/router/helper/menuHelper';

import projectSetting from '/@/settings/projectSetting';
import { listToTree,eachTree } from '/@/utils/helper/treeHelper';

import { PermissionModeEnum } from '/@/enums/appEnum';

import { asyncRoutes } from '/@/router/routes';
import { ERROR_LOG_ROUTE,HOME_ROUTE, PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';

import { filter } from '/@/utils/helper/treeHelper';

import { getMenuList } from '/@/api/sys/menu';
import { ModuleInfo,ModuleInfoObj } from '/@/api/sys/model/menuModel';
import { useMessage } from '/@/hooks/web/useMessage';
import { PageEnum } from '/@/enums/pageEnum';

interface PermissionState {
  // Permission code list
  // 权限代码列表
  permCodeList: string[];
  permCodeInfoList:ModuleInfo[];
  // Whether the route has been dynamically added
  // 路由是否动态添加
  isDynamicAddedRoute: boolean;
  // To trigger a menu update
  // 触发菜单更新
  lastBuildMenuTime: number;
  // Backstage menu list
  // 后台菜单列表
  backMenuList: Menu[];
  routeList: Menu[];
  // 菜单列表
  frontMenuList: Menu[];
}

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    // 权限代码列表
    permCodeList: [],
    permCodeInfoList: [],
    // Whether the route has been dynamically added
    // 路由是否动态添加
    isDynamicAddedRoute: false,
    // To trigger a menu update
    // 触发菜单更新
    lastBuildMenuTime: 0,
    // Backstage menu list
    // 后台菜单列表
    backMenuList: [],
    //所有list列表
    routeList: [],
    // menu List
    // 菜单列表
    frontMenuList: [],
  }),
  getters: {
    getPermCodeList(): string[] {
      return this.permCodeList;
    },
    getPermCodeInfoList(): ModuleInfo[] {
      return this.permCodeInfoList;
    },
    getBackMenuList(): Menu[] {
      return this.backMenuList;
    },
    getRouteList(): Menu[] {
      return this.routeList;
    },
    getFrontMenuList(): Menu[] {
      return this.frontMenuList;
    },
    getLastBuildMenuTime(): number {
      return this.lastBuildMenuTime;
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute;
    },
  },
  actions: {
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList;
    },
    setPermCodeInfoList(codeList: ModuleInfo[]) {
      this.permCodeInfoList = codeList;
    },

    setBackMenuList(list: Menu[]) {
      this.backMenuList = list;
      list?.length > 0 && this.setLastBuildMenuTime();
    },
    setRouteList(list: Menu[]) {
      this.routeList = list;
    },

    setFrontMenuList(list: Menu[]) {
      this.frontMenuList = list;
    },

    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime();
    },

    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    resetState(): void {
      this.isDynamicAddedRoute = false;
      this.permCodeList = [];
      this.backMenuList = [];
      this.lastBuildMenuTime = 0;
    },
    async changePermissionCode(codeMap) {
      let codeList:string[] = [];
      let codeInfoList:ModuleInfo[] = [];
      codeMap.forEach((value,key)=>{
        let values = value.map(item=>item.menuCode);
        let values1 = value.map(item => {
          return {
            parentCode: key,
            ...item
          }
        });
        codeList = codeList.concat(values);
        codeInfoList = codeInfoList.concat(values1);
      })
      // console.log(codeList,codeInfoList )
      this.setPermCodeList(codeList);
      this.setPermCodeInfoList(codeInfoList)
    },

    // 构建路由
    async buildRoutesAction(isNotRequest?:boolean,userMenus?:ModuleInfoObj | undefined): Promise<AppRouteRecordRaw[]> {
      const { t } = useI18n();
      const userStore = useUserStore();
      const appStore = useAppStoreWithOut();

      let routes: AppRouteRecordRaw[] = [];
      const roleList = toRaw(userStore.getRoleList) || [];
      const { permissionMode = projectSetting.permissionMode } = appStore.getProjectConfig;

      // 路由过滤器 在 函数filter 作为回调传入遍历使用
      const routeFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        // 抽出角色
        const { roles } = meta || {};
        if (!roles) return true;
        // 进行角色权限判断
        return roleList.some((role) => roles.includes(role));
      };

      const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        // ignoreRoute 为true 则路由仅用于菜单生成，不会在实际的路由表中出现
        const { ignoreRoute } = meta || {};
        // arr.filter 返回 true 表示该元素通过测试
        return !ignoreRoute;
      };

      /**
       * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
       * */
      const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {
        if (!routes || routes.length === 0) return;
        let homePath: string = userStore?.homePath || PageEnum.BASE_HOME;

        function patcher(routes: AppRouteRecordRaw[], parentPath = '') {
          if (parentPath) parentPath = parentPath + '/';
          routes.forEach((route: AppRouteRecordRaw) => {
            const { path, children, redirect } = route;
            const currentPath = path.startsWith('/') ? path : parentPath + path;
            if (currentPath === homePath) {
              if (redirect) {
                homePath = route.redirect! as string;
              } else {
                route.meta = Object.assign({}, route.meta, { affix: true });
                throw new Error('end');
              }
            }
            children && children.length > 0 && patcher(children, currentPath);
          });
        }

        try {
          patcher(routes);
        } catch (e) {
          // 已处理完毕跳出循环
        }
        return;
      };

      switch (permissionMode) {
        // 角色权限
        case PermissionModeEnum.ROLE:
          // 对非一级路由进行过滤
          routes = filter(asyncRoutes, routeFilter);
          // 对一级路由根据角色权限过滤
          routes = routes.filter(routeFilter);
          // Convert multi-level routing to level 2 routing
          // 将多级路由转换为 2 级路由
          routes = flatMultiLevelRoutes(routes);
          break;

        // 路由映射， 默认进入该case
        case PermissionModeEnum.ROUTE_MAPPING:
          // 对非一级路由进行过滤
          routes = filter(asyncRoutes, routeFilter);
          // 对一级路由再次根据角色权限过滤
          routes = routes.filter(routeFilter);
          // 将路由转换成菜单
          const menuList = transformRouteToMenu(routes, true);
          // 移除掉 ignoreRoute: true 的路由 非一级路由
          routes = filter(routes, routeRemoveIgnoreFilter);
          // 移除掉 ignoreRoute: true 的路由 一级路由；
          routes = routes.filter(routeRemoveIgnoreFilter);
          // 对菜单进行排序
          menuList.sort((a, b) => {
            return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0);
          });

          // 设置菜单列表
          this.setFrontMenuList(menuList);

          // Convert multi-level routing to level 2 routing
          // 将多级路由转换为 2 级路由
          routes = flatMultiLevelRoutes(routes);
          break;

        //  If you are sure that you do not need to do background dynamic permissions, please comment the entire judgment below
        //  如果确定不需要做后台动态权限，请在下方注释整个判断
        case PermissionModeEnum.BACK:
          const { createMessage } = useMessage();

          const loadingI = createMessage.loading({
            content: t('sys.app.menuLoading'),
            duration: 0,
          });

          // !Simulate to obtain permission codes from the background,
          // 模拟从后台获取权限码，
          // this function may only need to be executed once, and the 
          // 这个功能可能只需要执行一次，实际项目可以自己放在合适的时间
          let routeList: AppRouteRecordRaw[] = [];
          let routeListAll:ModuleInfoObj = {};
          let permissionCodeList: ModuleInfo[] = [];
          try {
            routeListAll = isNotRequest ? userMenus : (await getMenuList()) as ModuleInfoObj;
            // console.log('routeListAll',routeListAll)
            this.setRouteList(routeListAll.routeList);
          } catch (error) {
            console.error(error);
          }
          loadingI()
          // 将返回的模块对象转换成前端路由对象 返回非按钮类型的菜单
          const nodeParentMap = new Map();
          routeList = routeListAll.routeList
          eachTree(routeList, (item, _parent) => {
            const sn = item.sn;
            const parentCode = nodeParentMap.get(item.id);
            if (!parentCode) {
              nodeParentMap.set(item.id,sn)
            }
            item.path = item.url;
            item.meta = {
              title: item.name,
              icon: item.image,
              hideMenu: item.showStatus === 0,
              ignoreKeepAlive:item.keepAlive === 0 ? true : false
            };
            item.name = sn;
            item.component = item.component;
            return item
          })
          // routeList.forEach(item => {
          //   // menuObj[item.id] = item.sn
          //   const sn = item.sn;
          //   const parentCode = nodeParentMap.get(item.id);
          //   if (!parentCode) {
          //     nodeParentMap.set(item.id,sn)
          //   }
          //   item.path = item.url;
          //   item.meta = {
          //     title: item.name,
          //     icon: item.image,
          //     hideMenu: item.showStatus === 0,
          //     ignoreKeepAlive:item.keepAlive === 0 ? true : false
          //     // hideChildrenInMenu: item.sn==="ModelInfo",
          //     // frameSrc: item.sn==='doc'?'http://localhost:3100':''
          //   };
          //   item.name = sn;
          //   item.component = item.component;
          // });
          // routeList = listToTree(routeList, {id: 'id', children: 'children', pid: 'parentId',})
          // // 将后端返回的菜单处理 获取到按钮权限值
          // permissionCodeList = routeListAll.filter(item => item.menuType === '2')
          permissionCodeList = routeListAll.permissionCodeList
          let codeListMap = new Map()
          permissionCodeList.map(item => {
            const parentCode = nodeParentMap.get(item.parentId)
            if (codeListMap.get(parentCode)) {
              const list = codeListMap.get(parentCode)
              list.push(item)
              codeListMap.set(parentCode,list)
            } else {
              codeListMap.set(parentCode,[item])
            }
          })
          // console.log('codeListMap',codeListMap)
          this.changePermissionCode(codeListMap)
          // Dynamically introduce components
          // 动态引入组件
          routeList = transformObjToRoute(routeList);

          // console.log('routeList',routeList)

          //  Background routing to menu structure
          //  后台路由到菜单结构
          const backMenuList = transformRouteToMenu(routeList);
          this.setBackMenuList(backMenuList);

          // remove meta.ignoreRoute item
          // 删除 meta.ignoreRoute 项
          routeList = filter(routeList, routeRemoveIgnoreFilter);
          routeList = routeList.filter(routeRemoveIgnoreFilter);

          routeList = flatMultiLevelRoutes(routeList);
          // 设置一下目录路由的重定向路由
          eachTree(routeList, (item, _parent) => {
            if (item.children && item.children.length) {
              item.redirect = item.children[0].path
            }
            return item
          })
          // if (routeList?.length) {
          //   userStore.setHomePath(routeList[0].url)
          // } else {
          //   userStore.setHomePath(PageEnum.BASE_HOME)
          // }
          routes = [PAGE_NOT_FOUND_ROUTE, HOME_ROUTE, ...routeList];
          break;
      }

      routes.push(ERROR_LOG_ROUTE);
      patchHomeAffix(routes);
      return routes;
    },
  },
});

// Need to be used outside the setup
// 需要在设置之外使用
export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
