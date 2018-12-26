import { jsNative, } from "sx-jsbridge";
const { nativeRequestBaseParams } = jsNative;
export const getSearch = (props) => {
    let search = ""
    let pathname = decodeURIComponent(props.location.search)
    let url = pathname.match(/\$(\S*)\$/) ? pathname.match(/\$(\S*)\$/)[1] : "";

    if (!!url) {
        search = JSON.parse(url)
    }

    return search
}

export const trim = (str = '') =>{ //删除左右两端的空格
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

export const waitFunc = (time)=>{
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve()
    },time)
  })
}

export const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
export const regBankCard = /^[0-9]*$/
export const regMobile = /^[0-9]*$/
export const regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/

export const judgeEnv = ()=>{
  let env = '-test';
  if(window.location.host.indexOf('mpmw.vbill.cn')>-1 ){
    env = ''
  }  else if(window.location.host.indexOf('mpmw-rc.vbill.cn')>-1){
    env ='-rc'
  } else if(window.location.host.indexOf('mpmw-alpha.vbill.cn')>-1){
    env ='-alpha'
  } else if(window.location.host.indexOf('mpmw-test.vbill.cn')>-1){
    env ='-test'
  } else if(window.location.host.indexOf('mpmw-dev.vbill.cn')>-1) {
    env = '-dev'
  }
  return env;
}

/**
*   @author jerryxu
*   @methodName 免息期计算
*   @params mod
*   @description 免息期计算，已出账单延迟到下一个自然月
*/
export const computerFreePeriod  = (bill_type,payment_due_date)=>{

  const days =  bill_type == 'DONE' ?
    parseInt(moment(payment_due_date).diff(moment(), 'days')) + parseInt(moment().daysInMonth()) :
    parseInt(moment(payment_due_date).diff(moment(), 'days'))
  if(days >0){
    return days
  } else {
    return '--'
  }

}

/**
*   @author jerryxu
*   @methodName i
*   @params mod
*   @description
*/

export  function enterMethodList(){
  nativeRequestBaseParams().then(params=>{
    const appVersion=params['APP_VERSIONS'].split('.');
    let sum='';
    appVersion.forEach(v=>{sum+=v})
    const version=Number(sum);
    if(version>=330)  this.props.history.push('/3.4.0/importbills');
    else  this.props.history.push('/bill/method')
  })
}