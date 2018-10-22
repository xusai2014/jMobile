import {
  CHECK_CYBER_STATUS,
  GET_BANK_LIST,
  GET_BANK_LOGIN_LIST, LOGIN_CYBER,
  POLLING_CYBER,
  VERYFY_CODE_STARUS,
  BILL_LIST, BILL_DETAIL, PAY_DETAIL,
  HUAN_DAO,
  SYNC_BILL,
  FREE_INTEREST,
  EMAIL_LOGIN,
  EMAIL_TASK_STATUS, DELETE_BILL, DIRECT_EMAIL_BILL, EMAIL_LIST, DELETE_EMAIL, HANDLE_BILL, REMOVE_BILL_ALL_STATUS,
  ADTIVITY_DATA, ECHO_FOEM, BILL_DETAIL_LIST,
} from '../utils/ActionsType';

const initialState = {
  bankList: [],
  loginList: {},
  cyberTaskId:'',
  cyberTokenStatus:{},
  cyberStatus:{},
  verifyCodeStatus:{},
  CHECK_CYBER_BILL:{},
  billList:{},
  payDetail:[],
  huandaoData:{},
  syncBillStatus:{},
  freeIntrestData:[],
  emailLogin:{},
  emailTaskStatus:{},
  deleteBillStatus:{},
  emailList:[],
  handeBill:{},
  billDetail:{
    pageResponseDto:{
      pageList:[]
    }
  },
  billAllStatus:{

  },
  activityData:{},
  echoForm:{},
  billDetailList:{}
};
//全局状态信息，数据信息存储
export default function (state = initialState, actions) {
  switch (actions.type) {
    case GET_BANK_LIST[1]:
      const [creditCard = {}] = actions.data;
      const {bank_list = []} = creditCard
      return {
        ...state,
        bankList: bank_list
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
                username_regex, password_regex, username1_desc ='',username1_regex = '',...rest} = v;
              let items = [];
              items.push({
                name: username_desc, value: "",
                placeHolder: `请输入${username_desc}`,
                reg: username_regex,
              })
              username1_desc && items.push({
                name: username1_desc, value: "",
                placeHolder: `请输入${username1_desc}`,
                reg: username1_regex,
              })
              items.push({
                name: password_desc, value: '',
                icon: true,
                placeHolder: `请输入${password_desc}`,
                reg: password_regex,
              })


              return {
                title: `${username_desc}`,
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
    case BILL_LIST[1]:
      return {
        ...state,
        billList:actions.data,
      }
    case BILL_DETAIL[1]:
      return {
        ...state,
        billDetail:actions.data,
      }
    case PAY_DETAIL[1]:
      return {
        ...state,
        payDetail:actions.data
      }
    case HUAN_DAO[1]:
      return {
        ...state,
        haidaoData:actions.data,
      }
    case SYNC_BILL[1]:
      return {
        ...state,
        syncBillStatus:actions.data,
      }
    case FREE_INTEREST[1]:
      return {
        ...state,
        freeIntrestData:actions.data
      }
    case EMAIL_LOGIN[1]:
      return {
        ...state,
        emailLogin:actions.data
      }
    case EMAIL_TASK_STATUS[1]:
      return {
        ...state,
        emailTaskStatus:actions.data,
      }
    case DELETE_BILL[1]:
      return state;
    case DIRECT_EMAIL_BILL[1]:
      return state

    case EMAIL_LIST[1]:
      return {
        ...state,
        emailList:actions.data,
      }
    case DELETE_EMAIL[1]:
      return {
        ...state,
      }
    case HANDLE_BILL[1]:
      return {
        ...state,
        handeBill:actions.data
      }
    case REMOVE_BILL_ALL_STATUS[1]:
      return {
        ...state,
        billAllStatus:actions.data
      }
    case ADTIVITY_DATA[1]:
      return {
        ...state,
        activityData:actions.data
      }
    case ECHO_FOEM[1]:
      return {
        ...state,
        echoForm:actions.data,
      }
    case BILL_DETAIL_LIST[1]:
      return {
        ...state,
        billDetailList:actions.data,
      }
    default:
      return state
  }
}
