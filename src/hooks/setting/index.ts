import type { GlobConfig } from '/#/config';

import { warn } from '/@/utils/log';
import { getAppEnvConfig } from '/@/utils/env';

export const useGlobSetting = (): Readonly<GlobConfig> => {
  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_URL,
    VITE_GLOB_APP_KEY,
    VITE_GLOB_APP_CODE,
    VITE_GLOB_APP_CAS_BASE_URL,
    VITE_GLOB_APP_OPEN_SSO,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
  } = getAppEnvConfig();

  if (!/[a-zA-Z\_]*/.test(VITE_GLOB_APP_SHORT_NAME)) {
    warn(
      `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`,
    );
  }

  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    appUrl:VITE_GLOB_APP_URL,
    openSso: VITE_GLOB_APP_OPEN_SSO,
    casBaseUrl: VITE_GLOB_APP_CAS_BASE_URL,
    appKey: VITE_GLOB_APP_KEY,
    appCode: VITE_GLOB_APP_CODE,
    shortName: VITE_GLOB_APP_SHORT_NAME,
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
  };
  return glob as Readonly<GlobConfig>;
};
