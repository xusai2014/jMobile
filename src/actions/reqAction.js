import { ActionCreator } from '../utils/fetch-middleware';
import { GET_BANK_LIST, GET_BANK_LOGIN_LIST } from '../utils/ActionsType'

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

