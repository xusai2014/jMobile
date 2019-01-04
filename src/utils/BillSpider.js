/**
 *   @author jerryxu
 *   @methodName i
 *   @params mod
 *   @description
 */
import { jsNative } from 'sx-jsbridge';
import { Toast } from 'antd-mobile';
import { getEchoForm } from '../actions/reqAction';

const { nativeRequestBaseParams } = jsNative;

export const VersionNUm = 330;
export function enterMethodList(props) {
  nativeRequestBaseParams().then((params) => {
    const appVersion = params['APP_VERSIONS'].split('.');
    let sum = '';
    appVersion.forEach((v) => {
      sum += v;
    });
    const version = Number(sum);
    if (version >= VersionNUm) {
      props.history.push('/3.4.0/importbills');
    } else {
      props.history.push('/bill/method');
    }
  });
}

export function enterBankImport(props, abbr, bankName) {
  nativeRequestBaseParams().then((params) => {
    const appVersion = params['APP_VERSIONS'].split('.');
    let sum = '';
    appVersion.forEach((v) => {
      sum += v;
    });
    const version = Number(sum);
    if (version >= VersionNUm) {
      props.dispatch(getEchoForm({ bankName: abbr })).then((result) => {
        if (result) {
          const { data = [] } = result;
          const userInfo = data.map((v) => {
            const {
              bankLoginType,
              password,
              unMosaicUsername,
              uuid
            } = v;
            const [nameVal, username1] = unMosaicUsername.split(',');
            return {
              loginType: bankLoginType,
              name: nameVal,
              name1: username1,
              password,
              uuid
            };
          });
          updateBankForeground(abbr, userInfo, props);
        }
      }, () => {
      });
    } else {
      props.history.push(`/cyber/login/${abbr}`, { name: bankName });
    }
  });
}

export function goResult(loginType, status, description, props) {
  if (status === 1) {
    if (loginType === '01') {
      props.history.push('/result/cybersuccess', {
        result: description
      });
    } else if (loginType === '03') {
      props.history.push('/result/esuccess', {
        result: description
      });
    }
  } else if (status === 2) {
    if (loginType === '01') {
      props.history.push('/result/cybernodata', {
        result: description
      });
    } else if (loginType === '03') {
      props.history.push('/result/enodata', {
        result: description
      });
    }
  } else if (status === 3) {
    if (loginType === '01') {
      props.history.push('/result/cyberfailed', {
        result: description
      });
    } else if (loginType === '03') {
      props.history.push('/result/efailed', {
        result: description
      });
    }
  } else if (status === 4) {
    props.history.push('/result/unknowpage', {
      result: description
    });
  }
}

export function handleErroMsg(errorCode, errorMsg) {
  if (errorCode.includes('app')) {
    if (errorCode === 'app01') {
      return '导入账单中断，请重新导入';
    }
    if (errorCode === 'app02') {
      return '未知错误';
    }
    return '';
  } else if (errorCode.includes('api')) {
    return errorMsg;
  }
  return errorMsg;
}

export function addEmail(props) {
  JSBridge.invoke('emailImport', (response) => {
    const {
      errorCode,
      errorMsg,
      result
      // moxieData,
    } = response;
    if (result === 'SUCCESS') {
      goResult('03', 1, '导入成功', props);
    } else if (result === 'FAIL') {
      if (errorCode === 'app02') {
        goResult('03', 4, handleErroMsg(errorCode, errorMsg), props);
      } else {
        goResult('03', 3, handleErroMsg(errorCode, errorMsg), props);
      }
    } else if (result === 'CANCEL') {
      Toast.info('已取消导入');
    }
  }, {
    type: 'add',
    userInfo: {
      mailName: '',
      accountName: '',
      password: ''
    }
  });
}

export function updateEmail(userInfo, props) {
  const { emailType, account, password } = userInfo;
  const uuidInfo = userInfo ? userInfo.uuid : '';
  JSBridge.invoke('emailImport', (response) => {
    const {
      errorCode,
      errorMsg,
      result
      // moxieData,
    } = response;
    if (result === 'SUCCESS') {
      goResult('03', 1, '导入成功', props);
    } else if (result === 'FAIL') {
      if (errorCode === 'app02') {
        goResult('03', 4, handleErroMsg(errorCode, errorMsg), props);
      } else {
        goResult('03', 3, handleErroMsg(errorCode, errorMsg), props);
      }
    } else if (result === 'CANCEL') {
      Toast.info('已取消导入');
    }
  }, {
    type: 'update',
    uuid: uuidInfo,
    userInfo: {
      mailName: emailType,
      accountName: account,
      password
    }
  });
}

export function updateBankForeground(bankCode, userInfo, props) {
  const uuidInfo = userInfo.length > 0 ? userInfo[0].uuid : '';
  JSBridge.invoke('bankImport', (response) => {
    const {
      errorCode,
      errorMsg,
      result
      // moxieData,
    } = response;
    if (result === 'SUCCESS') {
      goResult('01', 1, '导入成功', props);
    } else if (result === 'FAIL') {
      if (errorCode === 'app02') {
        goResult('03', 4, handleErroMsg(errorCode, errorMsg), props);
      } else {
        goResult('03', 3, handleErroMsg(errorCode, errorMsg), props);
      }
    } else if (result === 'CANCEL') {
      Toast.info('已取消导入');
    }
  }, {
    type: 'update',
    runModel: 'foreground',
    bankCode,
    userInfo,
    uuid: uuidInfo
  });
}

export function addBank(props) {
  JSBridge.invoke('bankImport', (response) => {
    const {
      errorCode,
      errorMsg,
      result
      // moxieData,
    } = response;
    if (result === 'SUCCESS') {
      goResult('01', 1, '导入成功', props);
    } else if (result === 'FAIL') {
      if (errorCode === 'app02') {
        goResult('03', 4, handleErroMsg(errorCode, errorMsg), props);
      } else {
        goResult('03', 3, handleErroMsg(errorCode, errorMsg), props);
      }
    } else if (result === 'CANCEL') {
      Toast.info('已取消导入');
    }
  }, {
    type: 'add',
    userInfo: []
  });
}

