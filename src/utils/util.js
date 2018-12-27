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

export const trim = (str = '') => { //删除左右两端的空格
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

export const waitFunc = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

export const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
export const regBankCard = /^[0-9]*$/
export const regMobile = /^[0-9]*$/
export const regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/

export const judgeEnv = () => {
  let env = '-test';
  if (window.location.host.indexOf('mpmw.vbill.cn') > -1) {
    env = ''
  } else if (window.location.host.indexOf('mpmw-rc.vbill.cn') > -1) {
    env = '-rc'
  } else if (window.location.host.indexOf('mpmw-alpha.vbill.cn') > -1) {
    env = '-alpha'
  } else if (window.location.host.indexOf('mpmw-test.vbill.cn') > -1) {
    env = '-test'
  } else if (window.location.host.indexOf('mpmw-dev.vbill.cn') > -1) {
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
export const computerFreePeriod = (bill_type, payment_due_date) => {

  const days = bill_type == 'DONE' ?
    parseInt(moment(payment_due_date).diff(moment(), 'days')) + parseInt(moment().daysInMonth()) :
    parseInt(moment(payment_due_date).diff(moment(), 'days'))
  if (days > 0) {
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
export const VersionNUm = 330;

export function enterMethodList(props) {
  nativeRequestBaseParams().then(params => {
    const appVersion = params['APP_VERSIONS'].split('.');
    let sum = '';
    appVersion.forEach(v => {
      sum += v
    })
    const version = Number(sum);
    if (version >= VersionNUm) {
      props.history.push('/3.4.0/importbills');
    } else{
      props.history.push('/bill/method')
    }
  })
}

export function enterBankImport(props, abbr, bank_name,) {
  nativeRequestBaseParams().then(params => {
    const appVersion = params['APP_VERSIONS'].split('.');
    let sum = '';
    appVersion.forEach(v => {
      sum += v
    })
    const version = Number(sum);
    if (version >= VersionNUm) {
      JSBridge.invoke('bankImport', response => {
        const {
          errorCode,
          errorMsg,
          result,
          moxieData,
        } = response;
        if (result === 'SUCCESS') {
          goResult('01', 1, '导入成功', props)
        } else if (result === 'FAIL') {
          goResult('01', 1, errorMsg, props)
        } else if (result === 'CANCEL') {

        }
      }, {
        type: "add",
        userInfo: []
      });
    } else {
      props.history.push(`/cyber/login/${abbr}`, { name: bank_name })
    }
  })
}

export function goResult(loginType, status, description, props) {
  if (status == 1) {
    if (loginType == '01') {
      props.history.push('/result/cybersuccess', {
        result: description
      })
    } else if (loginType == '03') {
      props.history.push('/result/esuccess', {
        result: description
      })
    }
  } else if (status == 2) {
    if (loginType == '01') {
      props.history.push('/result/cybernodata', {
        result: description
      })
    } else if (loginType == '03') {
      props.history.push('/result/enodata', {
        result: description
      })
    }
  } else if (status == 3) {
    if (loginType == '01') {
      props.history.push('/result/cyberfailed', {
        result: description
      })
    } else if (loginType == '03') {
      props.history.push('/result/efailed', {
        result: description
      })
    }
  }
}