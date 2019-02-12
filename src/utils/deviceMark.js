// @flow
const ua:string = window.navigator.userAgent;
const isAndroid:boolean = /Android/i.test(ua);
const isIOS:boolean = /iPhone|iPad|iPod/i.test(ua);
const isMpos:boolean = /SuiXingPay-Mpos/i.test(ua);
const isWeixin:boolean = /MicroMessenger/i.test(ua);
const isXLM:boolean = /Xlm-app/i.test(ua);

export default {
  isAndroid,
  isIOS,
  isMpos,
  isWeixin,
  isXLM
};
