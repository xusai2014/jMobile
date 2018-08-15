import {
  ACTIVITY_CARD,
  CARDS_LIST, GET_BILL_ID, GET_IDENTITY_INFO, IDENTITY_BNK, JUDGE_SEL_CARD,
  LOOSE_CARD
} from "../utils/ActionsType";

const initialState = {
  cardsList:[],
  bindSelfCard:false,
  fromBank:{},
  identityInfo:{},
  looseCard:{},
  haveBill:{},
  activities:{},
};
//全局状态信息，数据信息存储
export default function (state = initialState, actions) {
  switch (actions.type) {
    case CARDS_LIST[1]:
      return {
        ...state,
        cardsList:actions.data
      }
    case JUDGE_SEL_CARD[1]:
      return {
        ...state,
        bindSelfCard:actions.data,
      }
    case IDENTITY_BNK[1]:
      return {
        ...state,
        fromBank:actions.data,
      }
    case GET_IDENTITY_INFO[1]:
      return {
        ...state,
        identityInfo:actions.data,
      }
    case LOOSE_CARD[1]:
      return {
        ...state,
        looseCard:actions.data
      }
    case GET_BILL_ID[1]:
      return {
        ...state,
        haveBill:actions.data,
      }
    case ACTIVITY_CARD[1]:
      return {
        ...state,
        activities:actions.data
      }
    default:
      return state
  }
}
