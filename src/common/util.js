export const getSearch = (props) => {
  let search = ""
  let pathname = decodeURIComponent(props.location.search)
  let url = pathname.match(/\$(\S*)\$/) ? pathname.match(/\$(\S*)\$/)[1] : "";

  if (!!url) {
    search = JSON.parse(url)
  }
  return search
}

export const trim = (str = '') => { //删除左右两端的空格
  return str.replace(/(^\s*)|(\s*$)/g, "");
}


export const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
export const regBankCard = /^[0-9]*$/
export const regMobile = /^[0-9]*$/
export const regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/

const ua = window.navigator.userAgent;
export const isAndroid = /Android/i.test(ua);
export const isIOS = /iPhone|iPad|iPod/i.test(ua);
export const isMpos = /SuiXingPay-Mpos/i.test(ua);
export const isWeixin = /MicroMessenger/i.test(ua);
export const isXLM = /Xlm-app/i.test(ua);



