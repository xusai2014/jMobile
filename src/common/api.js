/**
 *   @author jerryxu
 *   多环境配置
 */
import { MockUrl,EnvApiUrl } from "./constants";
const Mock  = true;

export const envApi = () => {
  const domainUrl = window.location.href;

  if (domainUrl.includes('test')) {
    return EnvApiUrl.test;
  }
  if (domainUrl.includes('rc')) {
    return EnvApiUrl.rc;
  }
  if (domainUrl.includes('alpha')) {
    return EnvApiUrl.alpha;
  }
  if (domainUrl.includes('mpaw-dev')) {
    return EnvApiUrl.dev;
  }
  if (domainUrl.includes('mpaw.vbill.cn')) {
    return EnvApiUrl.prod;
  }
  if (domainUrl.includes('mpaw.suixingpay.com')) {
    return EnvApiUrl.prod;
  }
  if(Mock){
    return MockUrl;
  } else {
    return '/new';
  }
}
