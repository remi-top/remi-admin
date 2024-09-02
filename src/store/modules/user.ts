import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';
import { ROLES_KEY, COMPANY_KEY, GROUP_KEY,HOME_PATH_KEY, TOKEN_KEY,TICKET_KEY, USER_INFO_KEY, USERID_KEY } from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { GetUserInfoModel, LoginParams, AuthLoginParams } from '/@/api/sys/model/userModel';
import { doLogout, getUserInfo, loginApi,loginByCodeApi } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { useSso } from '/@/hooks/web/useSso';
import { GetPreview } from '/@/api/sys/file'
import { h } from 'vue';
import { getAppEnvConfig } from '/@/utils/env';
import { LocaleLang,CompanyTenantLabelLocaleLang,DeptLabelLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { changeLocale,getLocale } = useLocale();
import { localeSetting } from '/@/settings/localeSetting';
import { useAppStore } from '/@/store/modules/app';
const appStore = useAppStore();
const { locale } = localeSetting;
const {
  VITE_GLOB_APP_URL,
} = getAppEnvConfig();
interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  ticket?: string;
  userId?: string;
  homePath?: string;
  companyTenantId?: string;
  groupTenantId?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    homePath:undefined,
    // token
    token: undefined,
    // ticket
    ticket: undefined,
    userId: undefined,
    companyTenantId: undefined,
    groupTenantId: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getHomePath(): string {
      return this.homePath || getAuthCache<string>(HOME_PATH_KEY);
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getTicket(): string {
      return this.ticket || getAuthCache<string>(TICKET_KEY);
    },
    getUserId(): string {
      return this.userId || getAuthCache<string>(USERID_KEY);
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setTicket(info: string | undefined) {
      this.ticket = info ? info : ''; // for null or undefined value
      setAuthCache(TICKET_KEY, info);
    },
    setUserId(info: string | undefined) {
      this.companyTenantId = info ? info : ''; // for null or undefined value
      setAuthCache(USERID_KEY, info);
    },
    setCompanyId(info: string | undefined) {
      this.companyTenantId = info ? info : ''; // for null or undefined value
      setAuthCache(COMPANY_KEY, info);
    },
    setGroupTenantId(info: string | undefined) {
      this.groupTenantId = info ? info : ''; // for null or undefined value
      setAuthCache(GROUP_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setHomePath(url: string | undefined) {
      this.homePath = url
      setAuthCache(HOME_PATH_KEY, url);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    // /**
    //  * @description: login
    //  */
    async login(
      params: LoginParams & AuthLoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        // console.log('loginParams',loginParams)
        const data = await loginApi({
          ...loginParams,
          state:Date.now(),
        }, mode);
        const { accessToken, ticket } = data;
        this.setTicket(ticket);
        // let { accessToken } = await loginByCodeApi({
        //   authType:'code',
        //   authCode,
        //   appSecret:'309e7a4a4a12c9aa0318ad29453112e14031ed81',
        //   appKey:loginParams.appKey
        // })
        // save token
        this.setToken(accessToken);
        return this.afterLoginAction(true);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;
      // get user info
      console.log('getToken',this.getToken);
      
      const userInfo = await this.getUserInfoAction();
      
      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction(true,{
            routeList: userInfo?.routeList,
            permissionCodeList: userInfo?.permissionCodeList
          });
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        
        goHome && (await router.replace(this.getHomePath|| PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;
      const userInfo = await getUserInfo();
      // let language = LocaleLang[userInfo?.language] || locale
      // console.log('language',language)
      // TODO
      // await changeLocale(language)
      appStore.setProjectConfig({
        menuSetting:{
          collapsed: true
        }
      })
      if (userInfo?.companyTenantId) {
        this.setCompanyId(userInfo.companyTenantId);
      }
      if (userInfo?.deptTenantId) {
        this.setGroupTenantId(userInfo.deptTenantId);
      }
      if (userInfo?.id) {
        this.setUserId(userInfo.id);
      }
      if(userInfo.headPic){
        userInfo.headPic = await GetPreview({
          fileName: userInfo.headPic
        })
      }
      // userInfo.companyTenantName = userInfo?.[CompanyTenantLabelLocaleLang[getLocale.value]]
      // userInfo.deptName = userInfo?.[DeptLabelLocaleLang[getLocale.value]]
      this.setUserInfo(userInfo);
      return userInfo
    },
    /**
     * @description: logout
     */
    async logout(goLogin = true) {
      if (this.getToken) {
        try {
          doLogout({
            ticket:this.getTicket,
            state:new Date().getTime(),
            redirectUrl:''
          });
        } catch {
          console.log('注销Token失败');
        }
      }
      setTimeout(async ()=> {
        this.setToken(undefined);
        this.setTicket(undefined);
        this.setCompanyId(undefined);
        this.setGroupTenantId(undefined);
        this.setSessionTimeout(false);
        this.setUserInfo(null);
        this.setUserId(undefined);
        // await useSso().ssoLoginOut();
        goLogin && (await router.push({
          path: PageEnum.BASE_LOGIN,
          query: {
            // 传入当前的路由，登录成功后跳转到当前路由
            redirect: router.currentRoute.value.fullPath,
          }
        }));
      })
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
    goToMainApp() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('layout.header.backMainApp') + '？'),
        onOk: async () => {
          window.location.replace(VITE_GLOB_APP_URL)
          // await this.logout(true);
        },
      });
    },  
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
