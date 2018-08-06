import { Toast } from "antd-mobile";

/**
 * 调用原生OCR功能
 * @param params
 * @returns {Promise<any>}
 * FIXME 待调试
 */
const nativeOcrFunc = (params = {}) => new Promise((resolve, reject) => {
  JSBridge.invoke('ocrFunc', (data) => {
    resolve(data)
  }, params)
});

/**
 * 获取原生获取的基础请求参数
 * @param request            暂不需请求参数
 * @returns {Promise<any>}
 * FIXME 待调试
 */
const nativeRequestBaseParams = (request = {}) => new Promise((resolve, reject) => {
  JSBridge.invoke('getRequestBaseParams', response => {
    resolve(response);
  }, request);
});

/**
 * 调用原生实名认证
 * @param request   暂不需要请求参数
 * FIXME 待调试
 */
const nativeGoRealName = (request = {}) => {
  JSBridge.invoke('goRealName', response => {}, request);
};

/**
 * 调用原生绑定设备
 * @param request            暂不需请求参数
 * FIXME 待调试
 */
const nativeGoBindDevice = (request = {}) => {
  JSBridge.invoke('goBoundDevice', response => {}, request);
};

/**
 * 调用原生刷卡交易
 * @param request
 * @returns {Promise<any>}
 * FIXME 待调试
 */
const nativeSwipePay = (request = {}) => new Promise((resolve, reject) => {
  JSBridge.invoke('nativeSwipePay', response => {
    resolve(response);
  }, request);
});

/**
 * 调用原生 支付宝 交易
 * @param request
 * @returns {Promise<any>}
 * FIXME 待调试
 */
const nativeAliPay = (request = {}) => new Promise((resolve, reject) => {
  JSBridge.invoke('nativeAlipay', response => {
    resolve(response);
  }, request);
});

/**
 * 调用原生打开一个新的 WebView
 * @param request
 * FIXME 待调试
 */
const nativeOpenNewWebView = (request = {}) => {
  JSBridge.invoke('openNewNativeWebView', response => {}, request);
};

/*
* 打开原生登录界面，登录成功后回到web页面
* @params { destination}
* */

const nativeLogin = (requst = {}) => new Promise((resolve,reject)=>{
  JSBridge.invoke('nativeLogin', response => {
    resolve(response);
  }, request);
});

/*
*   同步基本数据，用户Token 、用户状态、APP版本号
*
* */
const syncData = (request = {}) => {
  JSBridge.invoke('syncData', response => {}, request)
}

/**
 * 校验原生登录状态
 * @param request  暂不需请求参数
 * @returns {Promise<any>}
 * FIXME 待调试
 */
const checkNativeLoginStatus = (request = {}) => new Promise((resolve, reject) => {
  nativeRequestBaseParams(request).then(result => {
    result['TOKEN_ID'] ? resolve(result) : reject(result);
  });
});

/**
 * 跳转到原生优惠券列表
 * @param request
 */
const nativeGoCouponList = (request = {}) => {
  JSBridge.invoke('goCouponList', response => {}, request);
};

/**
 * 调用原生分享功能
 * @param request
 * @returns {Promise<any>}
 * FIXME 待调试
 */
const nativeShare = (request = {}) => {
  JSBridge.invoke('nativeShare', response => {}, request);
};

/**
 * 调用原生分享功能(包含web功能)
 * @param request
 * FIXME 待调试
 */
const nativeWebShare = (request = {}) => {
  JSBridge.invoke('nativeWebShare', response => {}, request);
};

/**
 * 是否展示开通VIP按钮
 * @param request
 */
const nativeIsShowOpenVipButton = (request = {}) => new Promise((resolve, reject) => {
  JSBridge.invoke('isShowButton', data => {
    resolve(data);
  }, request);
});

/**
 * 检验登录方法 TODO 待调试
 * @param callback          已登录状态回调
 * @param loginResultCall   登录成功后回调(不传默认会执行: 已登录状态回调)
 */
const loginHelper = (callback, loginResultCall) => {
  checkNativeLoginStatus().then(params => {
    // 已登录状态
    callback(params);
  }, () => {
    // 未登录状态
    nativeLogin().then(params => {
      if (params.status == '01') { // 登录成功 TODO 状态码未确认
        loginResultCall ? loginResultCall(params) : callback(params);
      } else {
        /* 登录取消 */
      }
    }).catch((err) => {
      Toast.show(`登录失败, 请重新尝试!`, 2, false);
    });
  }).catch((err) => {
    // 异常情况
    Toast.show(`程序异常, 请重新尝试!`, 2, false);
  });
};

export {
  nativeOcrFunc,
  nativeRequestBaseParams,
  nativeGoRealName,
  nativeGoBindDevice,
  nativeSwipePay,
  nativeAliPay,
  nativeOpenNewWebView,
  checkNativeLoginStatus,
  nativeLogin,
  nativeGoCouponList,
  nativeShare,
  loginHelper,
  nativeIsShowOpenVipButton,
  nativeWebShare,
}