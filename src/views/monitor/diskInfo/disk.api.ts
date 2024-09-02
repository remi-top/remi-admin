import { defHttp } from '/@/utils/http/axios';

enum Api {
  queryDiskInfo = '/sys/actuator/redis/queryDiskInfo',
}

/**
 * 详细信息
 */
export const queryDiskInfo = () => {
return Promise.resolve([
  {
      "name": "/",
      "rest": 18172035072,
      "restPPT": 51,
      "max": 37688381440
  }
]);
  return defHttp.get({ url: Api.queryDiskInfo }, { successMessageMode: 'none' });
};
