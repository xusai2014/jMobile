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
} from '../utils/ActionsType'

export const getBankList = (data) => ActionCreator(
  GET_BANK_LIST,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': GET_BANK_LIST[1]}
)();

export const getLoginList = (data) => ActionCreator(
  GET_BANK_LOGIN_LIST,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': GET_BANK_LOGIN_LIST[1]}
)();

export const loginCyber = (data) => ActionCreator(
  LOGIN_CYBER,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': LOGIN_CYBER[1]}
)();

export const checkToken = (data) => ActionCreator(
  CHECK_CYBER_STATUS,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': CHECK_CYBER_STATUS[1]}
)();


export const pollingCyber = (data) => ActionCreator(
  POLLING_CYBER,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': POLLING_CYBER[1]}
)();

export const verifyCode = (data) => ActionCreator(
  VERYFY_CODE_STARUS,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': VERYFY_CODE_STARUS[1]}
)();


export const getBillList = (data) => ActionCreator(
  BILL_LIST,
    `/api`,
    'POST',
    {...data, 'TRDE_CODE': BILL_LIST[1]}
  )();

  export const getBillDetail = (data) => ActionCreator(
    BILL_DETAIL,
    `/api`,
    'POST',
    {...data, 'TRDE_CODE': BILL_DETAIL[1]}
  )();


export const getPayDetail= (data) => ActionCreator(
  PAY_DETAIL,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': PAY_DETAIL[1]}
)();

export const getHUandao= (data) => ActionCreator(
  HUAN_DAO,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': HUAN_DAO[1]}
)();

export const syncBill= (data) => ActionCreator(
  SYNC_BILL,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': SYNC_BILL[1]}
)();

export const getFreeInterest= (data) => ActionCreator(
  FREE_INTEREST,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': FREE_INTEREST[1]}
)();


export const emailLogin = (data) => ActionCreator(
  EMAIL_LOGIN,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': EMAIL_LOGIN[1]}
)();

export const checkEmailTask = (data) => ActionCreator(
  EMAIL_TASK_STATUS,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': EMAIL_TASK_STATUS[1]}
)();


  export const deleteBill = (data) => ActionCreator(
    DELETE_BILL,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': DELETE_BILL[1]}
)();

export const directImport = (data) => ActionCreator(
  DIRECT_EMAIL_BILL,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': DIRECT_EMAIL_BILL[1]}
)();

export const getEmailList = (data) => ActionCreator(
  EMAIL_LIST,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': EMAIL_LIST[1]}
)();


export const removeEmail = (data) => ActionCreator(
  DELETE_EMAIL,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': DELETE_EMAIL[1]}
)();

export const getCardsList = (data) => ActionCreator(
  CARDS_LIST,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': CARDS_LIST[1]}
)();

export const judgeSelfCard = (data) => ActionCreator(
  JUDGE_SEL_CARD,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': JUDGE_SEL_CARD[1]}
)();

export const identityBank = (data) => ActionCreator(
  IDENTITY_BNK,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': IDENTITY_BNK[1]}
)();

export const postInfo = (data) => ActionCreator(
  POST_INFO,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': POST_INFO[1]}
)();

export const sendVerification = (data) => ActionCreator(
  SEND_VERIFICATION,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': SEND_VERIFICATION[1]}
)();

export const verifySMSCode = (data) => ActionCreator(
  VERIFY_CODE,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': VERIFY_CODE[1]}
)();

export const getIndetiyInfo = (data) => ActionCreator(
  GET_IDENTITY_INFO,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': GET_IDENTITY_INFO[1]}
)();

export const looseCard = (data) => ActionCreator(
  LOOSE_CARD,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': LOOSE_CARD[1]}
)();

export const handleBillForm = (data) => ActionCreator(
  HANDLE_BILL,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': HANDLE_BILL[1]}
)();

export const getBillId = (data) => ActionCreator(
  GET_BILL_ID,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': GET_BILL_ID[1]}
)();

export const getActivities = (data) => ActionCreator(
  ACTIVITY_CARD,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': ACTIVITY_CARD[1]}
)();

  export const removeLoginStatus = (data) => ActionCreator(
    REMOVE_LOGIN_STATUS,
    `/api`,
    'POST',
    {...data, 'TRDE_CODE': REMOVE_LOGIN_STATUS[1]}
  )();

export const removeBillAllStatus = (data) => ActionCreator(
  REMOVE_BILL_ALL_STATUS,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': REMOVE_BILL_ALL_STATUS[1]}
)();

export const getActivityData = (data) => ActionCreator(
  ADTIVITY_DATA,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': ADTIVITY_DATA[1]}
)();


export const setMarkBill = (data) => ActionCreator(
  MARK_BILL_STATUS,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': MARK_BILL_STATUS[1]}
)();

export const setBillRest = (data) => ActionCreator(
  MARK_BILL_REST,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': MARK_BILL_REST[1]}
)();

export const getEchoForm = (data) => ActionCreator(
  ECHO_FOEM,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': ECHO_FOEM[1]}
)();

export const getBillDetaillList = (data) => ActionCreator(
  BILL_DETAIL_LIST,
  `/api`,
  'POST',
  {...data, 'TRDE_CODE': BILL_DETAIL_LIST[1]}
)();











