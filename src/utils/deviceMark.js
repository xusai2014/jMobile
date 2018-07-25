const ua = window.navigator.userAgent;
const isAndroid = /Android/i.test(ua);
const isIOS = /iPhone|iPad|iPod/i.test(ua);
const isMpos = /SuiXingPay-Mpos/i.test(ua);
const isWeixin = /MicroMessenger/i.test(ua);
const isXLM = /Xlm-app/i.test(ua);

export default {
  isAndroid,
  isIOS,
  isMpos,
  isWeixin,
  isXLM
}