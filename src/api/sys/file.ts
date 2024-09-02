import { defHttp } from '/@/utils/http/axios';
type fileInfo = {
  companyTenantId?: string;
  createdAt?: string;
  createdBy?: string;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  groupTenantId?: string;
  id?: string;
  imageCheckUrl?: string;
}
enum Api {
  Upload = '/file/upload',
  share = '/file/share',
  Preview = '/file/preview',
}
import { useGlobSetting } from '/@/hooks/setting';
const globSetting = useGlobSetting();
const bucketCode = globSetting.appCode
export function Upload(params) {
  // console.log(params,'paramsparams');
  return defHttp.uploadFile<{data:fileInfo[]}>({ url: Api.Upload},{...params,data:{
    bucketCode:params.bucketCode ? params.bucketCode : bucketCode,
    directory:params.directory ? params.directory : ''
  },name:'multipartFile'});
}
export function GetUploadLink(params) {
  // console.log(params,'paramsparams');
  return defHttp.get<{data:fileInfo[]}>({ url: Api.share,params});
}
export function GetPreview(params) {
  // console.log(params,'paramsparams');
  const queryParam = {
    ...params,
    bucketCode:params.bucketCode ? params.bucketCode : bucketCode,
    directory:params.directory ? params.directory : '',
    fileName:params.fileName
  }
  return defHttp.get<string>({ url: Api.Preview,params:queryParam});
}
export type {fileInfo}