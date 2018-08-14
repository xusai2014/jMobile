import { Toast } from "antd-mobile";

/**
 * 调用原生OCR功能
 * @param params
 * @returns {Promise<any>}
 * FIXME android 待调试
 */
const nativeOcrBankCard = (params = {}) => new Promise((resolve, reject) => {
  /* 0000:成功; 0001:取消; 0002:未知; 0003:编辑; */
  JSBridge.invoke('nativeOcrBankCard', (data) => {
    resolve(data)
  }, params)
});

/**
 * 获取原生获取的基础请求参数
 * @param request            暂不需请求参数
 * @returns {Promise<any>}
 */
const nativeRequestBaseParams = (request = {}) => new Promise((resolve, reject) => {
  JSBridge.invoke('getRequestBaseParams', response => {
    resolve(response);
  }, request);
});

/**
 * 调用原生实名认证
 * @param request   暂不需要请求参数
 * FIXME android 待调试
 */
const nativeGoRealName = (request = {}) => {
  JSBridge.invoke('goRealName', response => {}, request);
};

/**
 * 调用原生绑定设备
 * @param request            暂不需请求参数
 * FIXME android 待调试
 */
const nativeGoBindDevice = (request = {}) => {
  JSBridge.invoke('goBoundDevice', response => {}, request);
};

/**
 * 跳转到原生刷卡界面
 * @param request
 */
const nativeGoSwipingCard = (request = {}) => {
  JSBridge.invoke('leaveForSwipingcard', null, request);
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
 */
const nativeOpenNewWebView = (request = {}) => {
  JSBridge.invoke('openNewNativeWebView', response => {}, request);
};

/*
 * 打开原生登录界面，登录成功后回到web页面
 */
const nativeLogin = (call) => {
  JSBridge.invoke('nativeLogin', response => {
    call(response);
  }, {});
};

/**
 * 调用原生退出登录方法,清空原生登录状态数据
 * FIXME 待调试
 */
const nativeQuitLogon = () => {
  JSBridge.invoke('quitLogon', response => {}, {});
}

/**
 * 校验原生登录状态
 * @param request  暂不需请求参数
 * @returns {Promise<any>}
 */
const checkNativeLoginStatus = (request = {}) => new Promise((resolve, reject) => {
  nativeRequestBaseParams(request).then(result => {
    result['token'] ? resolve(result) : reject(result);
  });
});

/**
 * 跳转到原生优惠券列表
 * @param request
 * FIXME android 待调试
 */
const nativeGoCouponList = (request = {}) => {
  JSBridge.invoke('goCouponList', response => {}, request);
};

/**
 * 调用原生分享功能
 * @param request
 * FIXME 待调试
 */
const nativeShare = (request = {}) => {
  JSBridge.invoke('nativeShare', response => {}, request);
};

/**
 * 调用原生分享功能(包含web功能)
 * @param request
 */
const nativeWebShare = (request = {}) => {
  JSBridge.invoke('nativeWebShare', response => {}, request);
};

/**
 * 原生将WebView保存为png
 * @param request
 * @returns {Promise<any>}
 */
const nativeSaveWebView2Png = (request = {}) => new Promise((resolve, reject) => {
  JSBridge.invoke('nativeSaveWebView2Png', response => {
    // if (response.result == '0000') {/* 成功 */} else {/* 失败 */}
    resolve(response);
  }, request);
});

/**
 * 是否展示开通VIP按钮
 * @param request
 * @returns {Promise<any>}
 */
const nativeIsShowOpenVipButton = (request = {}) => new Promise((resolve, reject) => {
  JSBridge.invoke('isShowButton', data => {
    resolve(data);
  }, request);
});

/**
 * 检验登录方法
 * @param callback          已登录状态回调
 * @param loginResultCall   登录成功后回调(不传默认会执行: 已登录状态回调)
 */
const loginHelper = (callback = () => {}, loginResultCall) => {
  checkNativeLoginStatus().then(params => {
    // 已登录状态
    callback(params);
  }, () => {
    // 未登录状态
    nativeLogin((params) => {
      if (params.errorCode == '0000') { // 登录成功
        loginResultCall ? loginResultCall(params) : callback(params);
      } else {
        /* 登录取消 */
        Toast.hide();
      }
    });
  });
};

export {
  nativeOcrBankCard,
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
  nativeSaveWebView2Png,
  nativeGoSwipingCard,
  nativeQuitLogon,
}