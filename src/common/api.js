/**
 *   @author jerryxu
 *   多环境配置
 */

export const envApi = () => {
  const url = {
    test: 'https://plus-gateway-test.suixingpay.com',
    dev: 'http://172.16.151.124:8080',
    prod: 'https://plus-gateway.suixingpay.com',
    alpha: 'https://plus-gateway-alpha.suixingpay.com',
    rc: 'https://plus-gateway-rc.suixingpay'
  };
  const domainUrl = window.location.href;

  if (domainUrl.includes('test')) {
    return url.test;
  }
  if (domainUrl.includes('rc')) {
    return url.rc;
  }
  if (domainUrl.includes('alpha')) {
    return url.alpha;
  }
  if (domainUrl.includes('mpaw-dev')) {
    return url.dev;
  }
  if (domainUrl.includes('mpaw.vbill.cn')) {
    return url.prod;
  }
  if (domainUrl.includes('mpaw.suixingpay.com')) {
    return url.prod;
  }
  return '/new';
}
