import {
  CHECK_CYBER_STATUS,
  GET_BANK_LIST,
  GET_BANK_LOGIN_LIST, LOGIN_CYBER,
  POLLING_CYBER,
  VERYFY_CODE_STARUS,
} from '../utils/ActionsType';

const initialState = {
  bankList: [],
  loginList: {},
  cyberTaskId:'',
  cyberTokenStatus:{},
  cyberStatus:{},
  verifyCodeStatus:{},
};
//全局状态信息，数据信息存储
export default function (state = initialState, actions) {
  switch (actions.type) {
    case GET_BANK_LIST[1]:
      const [creditCard = {}] = actions.data;
      const {bank_list = []} = creditCard
      return {
        ...state,
        bankList: [
          ...state.bankList,
          ...bank_list
        ]
      }

    case GET_BANK_LOGIN_LIST[1]:
      const {subtype, logins = []} = actions.data;

      return {
        ...state,
        loginList: {
          ...state.loginList,
          [subtype]: _.values(
            logins.map((v, k) => {
              const {
                login_type, password_desc, username_desc,
                username_regex, password_regex, ...rest
              } = v;
              const items = [{
                name: username_desc, value: "",
                placeHolder: `请输入${username_desc}`,
                reg: username_regex,
                login_type,
              }, {
                name: password_desc, value: '',
                icon: true,
                placeHolder: `请输入${password_desc}`,
                reg: password_regex,
                login_type,
              },]

              return {
                title: login_type == "IDCARD" ?
                  "身份证" : (
                    login_type == "CREDITCARDNO" ? "用户名" : "手机号"
                  ),
                items,
                login_type,
                ...rest
              }
            })
          )
        }

      }

    case LOGIN_CYBER[1]:
      return {
        ...state,
        cyberTaskId: actions.data
      }
    case CHECK_CYBER_STATUS[1]:
      return {
        ...state,
        cyberTokenStatus:actions.data,
      }
    case POLLING_CYBER[1]:
      return {
        ...state,
        cyberStatus:actions.data,
      }
    case VERYFY_CODE_STARUS[1]:
      return {
        ...state,
        verifyCodeStatus:actions.data,
      }
    default:
      return state
  }
}
