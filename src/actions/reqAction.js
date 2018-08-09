import { ActionCreator } from '../utils/fetch-middleware';
import {CHECK_CYBER_STATUS, GET_BANK_LIST, GET_BANK_LOGIN_LIST, LOGIN_CYBER, VERYFY_CODE_STARUS} from '../utils/ActionsType'

export const getBankList = (data) => ActionCreator(
  GET_BANK_LIST,
  `/api`,
  'POST',
  {...data,'TRDE_CODE':GET_BANK_LIST[1]}
  )();

export const getLoginList = (data) => ActionCreator(
  GET_BANK_LOGIN_LIST,
  `/api`,
  'POST',
  {...data,'TRDE_CODE':GET_BANK_LOGIN_LIST[1]}
)();

export const loginCyber = (data) => ActionCreator(
  LOGIN_CYBER,
  `/api`,
  'POST',
  {...data,'TRDE_CODE':LOGIN_CYBER[1]}
)();

export const checkToken = (data) => ActionCreator(
  CHECK_CYBER_STATUS,
  `/api`,
  'POST',
  {...data,'TRDE_CODE':CHECK_CYBER_STATUS[1]}
)();


export const pollingCyber = (data) => ActionCreator(
  POLLING_CYBER,
  `/api`,
  'POST',
  {...data,'TRDE_CODE':POLLING_CYBER[1]}
)();

export const verifyCode = (data) => ActionCreator(
  VERYFY_CODE_STARUS,
  `/api`,
  'POST',
  {...data,'TRDE_CODE':VERYFY_CODE_STARUS[1]}
)();



