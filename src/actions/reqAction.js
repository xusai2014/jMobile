// @flow
import { ActionCreator } from '../utils/fetch-middleware';
import {
  POLLING_CYBER,
  CHECK_CYBER_STATUS,
  GET_BANK_LIST,
  GET_BANK_LOGIN_LIST,
  LOGIN_CYBER,
  VERYFY_CODE_STARUS,
  BILL_LIST, BILL_DETAIL, PAY_DETAIL, HUAN_DAO, SYNC_BILL, FREE_INTEREST, EMAIL_LOGIN, EMAIL_TASK_STATUS, DELETE_BILL,
  DIRECT_EMAIL_BILL, EMAIL_LIST, DELETE_EMAIL, CARDS_LIST, JUDGE_SEL_CARD, IDENTITY_BNK, POST_INFO, SEND_VERIFICATION,
  VERIFY_CODE, GET_IDENTITY_INFO, LOOSE_CARD, HANDLE_BILL, GET_BILL_ID, ACTIVITY_CARD, REMOVE_LOGIN_STATUS,
  REMOVE_BILL_ALL_STATUS, ADTIVITY_DATA, MARK_BILL_STATUS, MARK_BILL_REST, ECHO_FOEM, BILL_DETAIL_LIST
} from '../utils/ActionsType';

export const getBankList = (data:any) => actionGenerator({ type: GET_BANK_LIST, data });
export const getLoginList = (data:any) => actionGenerator({ type: GET_BANK_LOGIN_LIST, data });
export const loginCyber = (data:any) => actionGenerator({ type: LOGIN_CYBER, data });
export const checkToken = (data:any) => actionGenerator({ type: CHECK_CYBER_STATUS, data });
export const pollingCyber = (data:any) => actionGenerator({ type: POLLING_CYBER, data });
export const verifyCode = (data:any) => actionGenerator({ type: VERYFY_CODE_STARUS, data });
export const getBillList = (data:any) => actionGenerator({ type: BILL_LIST, data });
export const getBillDetail = (data:any) => actionGenerator({ type: BILL_DETAIL, data });
export const getPayDetail = (data:any) => actionGenerator({ type: PAY_DETAIL, data });
export const getHUandao = (data:any) => actionGenerator({ type: HUAN_DAO, data });
export const syncBill = (data:any) => actionGenerator({ type: SYNC_BILL, data });
export const getFreeInterest = (data:any) => actionGenerator({ type: FREE_INTEREST, data });
export const emailLogin = (data:any) => actionGenerator({ type: EMAIL_LOGIN, data });
export const checkEmailTask = (data:any) => actionGenerator({ type: EMAIL_TASK_STATUS, data });
export const deleteBill = (data:any) => actionGenerator({ type: DELETE_BILL, data });
export const directImport = (data:any) => actionGenerator({ type: DIRECT_EMAIL_BILL, data });
export const getEmailList = (data:any) => actionGenerator({ type: EMAIL_LIST, data });
export const removeEmail = (data:any) => actionGenerator({ type: DELETE_EMAIL, data });
export const getCardsList = (data:any) => actionGenerator({ type: CARDS_LIST, data });
export const judgeSelfCard = (data:any) => actionGenerator({ type: JUDGE_SEL_CARD, data });
export const identityBank = (data:any) => actionGenerator({ type: IDENTITY_BNK, data });
export const postInfo = (data:any) => actionGenerator({ type: POST_INFO, data });
export const sendVerification = (data:any) => actionGenerator({ type: SEND_VERIFICATION, data });
export const verifySMSCode = (data:any) => actionGenerator({ type: VERIFY_CODE, data });
export const getIndetiyInfo = (data:any) => actionGenerator({ type: GET_IDENTITY_INFO, data });
export const looseCard = (data:any) => actionGenerator({ type: LOOSE_CARD, data });
export const handleBillForm = (data:any) => actionGenerator({ type: HANDLE_BILL, data });
export const getBillId = (data:any) => actionGenerator({ type: GET_BILL_ID, data });
export const getActivities = (data:any) => actionGenerator({ type: ACTIVITY_CARD, data });
export const removeLoginStatus = (data:any) => actionGenerator({ type: REMOVE_LOGIN_STATUS, data });
export const removeBillAllStatus = (data:any) => actionGenerator({ type: REMOVE_BILL_ALL_STATUS, data });
export const getActivityData = (data:any) => actionGenerator({ type: ADTIVITY_DATA, data });
export const setMarkBill = (data:any) => actionGenerator({ type: MARK_BILL_STATUS, data });
export const setBillRest = (data:any) => actionGenerator({ type: MARK_BILL_REST, data });
export const getEchoForm = (data: any) => actionGenerator({ type: ECHO_FOEM, data });
export const getBillDetaillList = (data: any) => actionGenerator({ type: BILL_DETAIL_LIST, data });

export const actionGenerator = ({ data, type }: any) => ActionCreator({
  type,
  method: 'POST',
  data: { ...data, TRDE_CODE: type[1] }
})();
