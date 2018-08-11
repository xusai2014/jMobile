import { ActionCreator } from '../utils/fetch-middleware';
import {
  POLLING_CYBER,
  CHECK_CYBER_STATUS,
  GET_BANK_LIST,
  GET_BANK_LOGIN_LIST,
  LOGIN_CYBER,
  VERYFY_CODE_STARUS,
  BILL_LIST, BILL_DETAIL, PAY_DETAIL
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





