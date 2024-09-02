import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel, AuthLoginParams, AuthLoginResultModel } from './model/userModel';
import { ModuleInfo } from './model/menuModel';
import { ErrorMessageMode } from '/#/axios';
import { data } from './menu.json'
import { MenuLocaleLang } from '/@/enums/appEnum';
import { eachTree, filter} from '/@/utils/helper/treeHelper';
import { useLocale } from '/@/locales/useLocale'
import { useGlobSetting } from '/@/hooks/setting';
import { useMessage } from '/@/hooks/web/useMessage';
import { ExceptionEnum } from "/@/enums/exceptionEnum";
const { createErrorModal } = useMessage();
const globSetting = useGlobSetting();
const appCode = globSetting.appCode;
const { getLocale } = useLocale();
import { useUserStoreWithOut } from '/@/store/modules/user';
enum Api {
  Login = '/sso/login/local?',
  Logout = '/sso/logout',
  GetUserInfo = '/user/token/',
  UpdatePwd = '/user/updatePwd',
  GetAccessToken = '/sso/oauth2/accessToken',//获取短信验证码的接口
  getCaptcha = '/sys/sms',
}
// export function updateLanguage(params: any) {
//   return defHttp.post({
//     url: Api.UpdateLanguage,
//     params,
//   });
// }
export function updatePwd(params) {
  return defHttp.put<LoginResultModel>(
    {
      url: Api.UpdatePwd,
      params
    }
  );
}
/**
 * 获取配置信息
 */
export function getSystemSettings() {
  // 测试先屏蔽
  return Promise.resolve([])
  return defHttp.get<LoginResultModel>(
    {
      url: Api.GetSystemSettings,
    }
  );
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams & AuthLoginParams, mode: ErrorMessageMode = 'modal') {
  // 测试先屏蔽
  // return Promise.resolve({accessToken: '90457cdd-8498-4fcb-a9bc-8b765b00d6f6'});
  return defHttp.postForm<LoginResultModel>(
    {
      url: `${Api.Login}redirectUrl=${params.redirectUrl}&appKey=${params.appKey}&state=${params.state}`,
      // data:formData
      // url:Api.Login,
      params:{
        loginName:params.username,
        password:params.password
      },

    },
    {
      errorMessageMode: 'none',
    },
  ).then(res=>{
    return Promise.resolve(res);
  });
}
/**
 * @description: user login api
 */
export function loginApiByTicket(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  // 测试先屏蔽
  return Promise.resolve({token: '90457cdd-8498-4fcb-a9bc-8b765b00d6f6'});
  return defHttp.get<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  ).then(res=>{
    return Promise.resolve(res);
  });
}
export function loginByCodeApi(params: AuthLoginParams,mode: ErrorMessageMode = 'modal',errorLogout:Boolean=true) {
  return Promise.resolve({accessToken: '90457cdd-8498-4fcb-a9bc-8b765b00d6f6'});
  return defHttp.get<AuthLoginResultModel>(
    {
      url: Api.GetAccessToken,
      params,
    },
    { errorMessageMode: 'modal',errorLogout }
  ).then(res=>{
    return Promise.resolve(res);
  });
}
/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  // return data
  const userStore = useUserStoreWithOut();
  const token = userStore.getToken
  const result = defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo+token }, { errorMessageMode: 'modal' });
  // const result = data
  return Promise.resolve(result).then(async data => {
    let userMenus = data.userMenus ? data.userMenus : []
    let list = userMenus.find(i => i.appCode == appCode)?.menuTree
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
    let routeList = filter(
      list,
      (item)=>{return item.menuType != 3},
      {
        id: 'id',
        children: 'children',
        pid: 'parentId'
      }
    )
    return {
      ...data,
      routeList,
      permissionCodeList
    }
  });
}
export function doLogout(params:AuthLoginParams) {
  return defHttp.get({ url: Api.Logout,params });
}
/**
 * @description: 获取短信验证码
 */
export function getCaptcha(params) {
  return new Promise((resolve, reject) => {
    defHttp.post({ url: Api.getCaptcha, params }, { isTransformResponse: false }).then((res) => {
      console.log(res);
      if (res.success) {
        resolve(true);
      } else {
        //update-begin---author:wangshuai---date:2024-04-18---for:【QQYUN-9005】同一个IP，1分钟超过5次短信，则提示需要验证码---
        if(res.code != ExceptionEnum.PHONE_SMS_FAIL_CODE){
          createErrorModal({ title: '错误提示', content: res.message || '未知问题' });
          reject();
        }
        reject(res);
        //update-end---author:wangshuai---date:2024-04-18---for:【QQYUN-9005】同一个IP，1分钟超过5次短信，则提示需要验证码---
      }
    }).catch((res)=>{
      createErrorModal({ title: '错误提示', content: res.message || '未知问题' });
      reject();
    });
  });
}
