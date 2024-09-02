// 单点登录核心类
import { getToken } from '/@/utils/auth';
import { getUrlParam } from '/@/utils';
import { useGlobSetting } from '/@/hooks/setting';
import { loginByCodeApi } from '/@/api/sys/user';
import { useUserStore } from '/@/store/modules/user';
const globSetting = useGlobSetting();
const openSso = globSetting.openSso;
const appKey = globSetting.appKey;
export function useSso() {
  //update-begin---author:wangshuai---date:2024-01-03---for:【QQYUN-7805】SSO登录强制用http #957---
  let locationUrl = document.location.protocol +"//" + window.location.host + '/#/authLogin';
  //update-end---author:wangshuai---date:2024-01-03---for:【QQYUN-7805】SSO登录强制用http #957---

  /**
   * 单点登录
   */
  async function ssoLogin() {
    if (openSso == 'true') {
      let token = getToken();
      let authCode = getUrlParam('authCode');
      console.log('token',token)
      console.log('authCode',authCode)
      // if (!token) {
        if (authCode) {
          await loginByCodeApi({
            authCode,
          }).then((res) => {
            const userStore = useUserStore();
            userStore.setToken(res.accessToken);
            return userStore.afterLoginAction(true, {});
          });
        } else {
          window.location.href = globSetting.casBaseUrl + '/#/login?redirectUrl=' + encodeURIComponent(locationUrl)+'&appKey='+appKey;
        }
      }
    // }
  }

  /**
   * 退出登录
   */
  async function ssoLoginOut() {
    window.location.href = globSetting.casBaseUrl + '/#/logout?redirectUrl=' + encodeURIComponent(locationUrl)+'&appKey='+appKey;
  }
  return { ssoLogin, ssoLoginOut };
}
