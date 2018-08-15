/**
 * 注册原生控制web界面跳转的方法
 * @param context                   上下文环境, 一般为this
 * @param functionName              原生调用的方法名字
 * @param routePath                 跳转的路由路径
 * @param params                    跳转携带的参数(web自己携带)
 */
export const registerOpenWebPage = ({ context, functionName, routePath = '', params = {} }) => {
  JSBridge && JSBridge.register(functionName, () => {
    context.props.history.push(routePath, params);
  });
};

/**
 * 原生跳转到 web 推荐好友二维码 界面
 * @param context
 * @param params
 */
export const registerOpenInvitationFriendQRCodePage = (context, params) => {
  registerOpenWebPage({
    context,
    functionName: 'openInvitationFriendQRCodePage',
    routePath: '/activity/InvitationFriendQRCode',
    params
  });
};

/**
 * 原生调用 web 推荐好友 分享流程
 */
export const registerShareInvitationFriend = (shareMethod) => {
  JSBridge && JSBridge.register("shareInvitationFriend", () => {
    shareMethod && shareMethod();
  });
};