// @flow
/* eslint-disable */

/**
 *   @author jerryxu
 *   @params TRDE_CDODE 接口编码
 */
const generate = (TRDE_CDODE: string): ActionType => ['REQUEST', TRDE_CDODE, 'FAILURE'];

export const ERROR = 'ERROR';
export const CLEAR_MSG = 'CLEAR_MSG';
export const ASYNC_COOKIE = 'ASYNC_COOKIE';

export const COMMONT_PAGE_NUMBER = 'COMMONT_PAGE_NUMBER';
// 个性限额分页
export const FORM_SET = 'FORM_SET';

export const SET_UUID = 'SET_UUID';

// 或许魔蝎提供可登录的网银列表
export const GET_BANK_LIST: ActionType = generate('CH801');
// 获取网银登录方式
export const GET_BANK_LOGIN_LIST: ActionType = generate('CH802');
// 登录接口
export const LOGIN_CYBER: ActionType = generate('CH803');

// 检查登录状态，输入验证码
export const VERYFY_CODE_STARUS: ActionType = generate('CH804');

// 检查网银任务状态
export const CHECK_CYBER_STATUS: ActionType = generate('CH805');

// 账单列表
export const BILL_LIST: ActionType = generate('CH807');

// 检查账单导入状态
export const POLLING_CYBER: ActionType = generate('CH810');

// 账单详情

export const BILL_DETAIL: ActionType = generate('CH808');

// 还款记录
export const PAY_DETAIL: ActionType = generate('CH819');

// 还到
export const HUAN_DAO: ActionType = generate('CH818');

// 同步
export const SYNC_BILL: ActionType = generate('CH806');

// 免息期
export const FREE_INTEREST: ActionType = generate('CH812');

// 邮箱登录
export const EMAIL_LOGIN: ActionType = generate('CH813');

// 邮箱创建任务状态
export const EMAIL_TASK_STATUS: ActionType = generate('CH815');

// 删除账单

export const DELETE_BILL: ActionType = generate('CH821');

// 直接导入邮箱，创建任务和直接登录

export const DIRECT_EMAIL_BILL: ActionType = generate('CH817');

// 绑定邮箱列表的接口
export const EMAIL_LIST: ActionType = generate('CH816');

// 删除邮箱
export const DELETE_EMAIL: ActionType = generate('CH822');

// 信用卡卡包列表接口
export const CARDS_LIST: ActionType = generate('M511');

// 判断是否绑定了本人卡

export const JUDGE_SEL_CARD: ActionType = generate('CH823');

// 发卡行

export const IDENTITY_BNK: ActionType = generate('CH828');

// M512,M502.M503
// 提交信息
export const POST_INFO: ActionType = generate('M512');
// 发送验证码
export const SEND_VERIFICATION: ActionType = generate('M502');
// 验证验证码
export const VERIFY_CODE: ActionType = generate('M503');

// 实名认证接口
export const GET_IDENTITY_INFO: ActionType = generate('M113');

// 解绑信用卡
export const LOOSE_CARD: ActionType = generate('M814');

// 手写账单
export const HANDLE_BILL: ActionType = generate('CH811');

// 查看账单编号
export const GET_BILL_ID: ActionType = generate('CH824');

// 活动列表
export const ACTIVITY_CARD: ActionType = generate('CH820');

// 删除登录状态
export const REMOVE_LOGIN_STATUS: ActionType = generate('CH826');

// 删除账单及任务状态
export const REMOVE_BILL_ALL_STATUS: ActionType = generate('CH827');

// 广告位接口
export const ADTIVITY_DATA: ActionType = generate('MP013');

// Mark Bill
export const MARK_BILL_STATUS: ActionType = generate('CH829');
// Mark rest

export const MARK_BILL_REST: ActionType = generate('CH830');

// echo
export const ECHO_FOEM: ActionType = generate('CH831');

// BILL list
export const BILL_DETAIL_LIST: ActionType = generate('CH832');
