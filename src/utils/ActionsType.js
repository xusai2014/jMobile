export const  ERROR = 'ERROR';
export const CLEAR_MSG = 'CLEAR_MSG';
export const ASYNC_COOKIE='ASYNC_COOKIE';

export const COMMONT_PAGE_NUMBER='COMMONT_PAGE_NUMBER'
// 个性限额分页
export const FORM_SET='FORM_SET';

export const SET_UUID='SET_UUID';

//或许魔蝎提供可登录的网银列表
export const GET_BANK_LIST = ['REQUEST', 'CH801','FAILURE'];
//获取网银登录方式
export const GET_BANK_LOGIN_LIST = ['REQUEST', 'CH802','FAILURE'];
//登录接口
export const LOGIN_CYBER = ['REQUEST', 'CH803','FAILURE'];

//检查登录状态，输入验证码
export const VERYFY_CODE_STARUS = ['REQUEST', 'CH804','FAILURE'];

//检查网银任务状态
export const CHECK_CYBER_STATUS = ['REQUEST', 'CH805','FAILURE'];

//账单列表
export const BILL_LIST = ['REQUEST', 'CH807','FAILURE'];

//检查账单导入状态
export const POLLING_CYBER = ['REQUEST', 'CH810','FAILURE'];

//账单详情

export const BILL_DETAIL = ['REQUEST', 'CH808','FAILURE'];

//还款记录
export const PAY_DETAIL = ['REQUEST', 'CH819','FAILURE'];

//还到
export const HUAN_DAO = ['REQUEST', 'CH818','FAILURE'];

//同步
export const SYNC_BILL = ['REQUEST', 'CH806','FAILURE'];

//免息期
export const FREE_INTEREST = ['REQUEST', 'CH812','FAILURE'];

//邮箱登录
export const EMAIL_LOGIN = ['REQUEST', 'CH813','FAILURE'];

//邮箱创建任务状态
export const EMAIL_TASK_STATUS = ['REQUEST', 'CH815','FAILURE'];


//删除账单

export const DELETE_BILL = ['REQUEST','CH821','FAILURE'];

//直接导入邮箱，创建任务和直接登录

export const DIRECT_EMAIL_BILL = ['REQUEST','CH817','FAILURE'];

//绑定邮箱列表的接口
export const EMAIL_LIST = ['REQUEST','CH816','FAILURE'];

//删除邮箱
export const DELETE_EMAIL = ['REQUEST','CH822','FAILURE'];


//信用卡卡包列表接口
export const CARDS_LIST = ['REQUEST','M511','FAILURE'];

//判断是否绑定了本人卡

export const JUDGE_SEL_CARD = ['REQUEST','CH823','FAILURE'];

//发卡行

export const IDENTITY_BNK = ['REQUEST','M543','FAILURE'];

//M512,M502.M503
//提交信息
export const POST_INFO = ['REQUEST','M512','FAILURE'];
//发送验证码
export const SEND_VERIFICATION = ['REQUEST','M502','FAILURE'];
//验证验证码
export const VERIFY_CODE = ['REQUEST','M503','FAILURE'];

//实名认证接口
export const GET_IDENTITY_INFO = ['REQUEST','M113','FAILURE'];

//解绑信用卡
export const LOOSE_CARD = ['REQUEST','M814','FAILURE'];

//手写账单
export const HANDLE_BILL = ['REQUEST','CH811','FAILURE'];

//查看账单编号
export const GET_BILL_ID = ['REQUEST','CH824','FAILURE'];

//活动列表
export const ACTIVITY_CARD = ['REQUEST','CH820','FAILURE'];