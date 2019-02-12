import { ASYNC_COOKIE, CLEAR_MSG, FORM_SET, SET_UUID } from '../utils/ActionsType';
import deviceMark from "../utils/deviceMark";

const initialState = {
  loginToken: '',
  requestStaus: false,
  errMsg: '',
  formTemp: {},
  uuid: '',
  isLogged: false,
  reqParams: {
    APPVERSION: '',
    OSVERSION: '',
    PLATFORM: '',
    TOKEN_ID: '',
    CHANNEL_NO: ""
  }
};
//全局状态信息，数据信息存储
export default function (state = initialState, actions = {}) {
  switch (actions.type) {
    case 'syncData':
      const { TOKEN_ID = '', mobileNoEnc = '' } = actions.data
      return {
        ...state,
        isLogged: deviceMark.isIOS ? !!TOKEN_ID : !!TOKEN_ID && !!mobileNoEnc,
        reqParams: {
          ...state.reqParams,
          APPVERSION: actions.data['APP_VERSIONS'],
          OSVERSION: actions.data['PHONE_VERSIONS'],
          PLATFORM: actions.data['PHONE_PLATFORM'],
          TOKEN_ID: actions.data['TOKEN_ID'],
          CHANNEL_NO: actions.data['channelNo'],

        }
      };
    case 'REQUEST':
      return {
        ...state,
        requestStaus: true
      };
    case 'FINISH':
      const { data } = actions;
      return {
        ...state,
        type: data,
        requestStaus: false
      }
    case 'FAILURE':
      return {
        ...state,
        errMsg: actions.data.err ? actions.data.err.message : actions.data.message,
        requestStaus: false
      };
    case ASYNC_COOKIE:

      return {
        ...state,
        ...actions.data
      };
    case CLEAR_MSG:
      return {
        ...state,
        errMsg: actions.data,
      }
    case FORM_SET:
      return {
        ...state,
        formTemp: {
          ...state.formTemp,
          ...actions.data,
        }
      }
    case SET_UUID:
      return {
        ...state,
        ...actions.data,
      }

    default:
      return state
  }
}
