import {CARDS_LIST} from "../utils/ActionsType";

const initialState = {
 cardsList:[]
};
//全局状态信息，数据信息存储
export default function (state = initialState, actions) {
  switch (actions.type) {
    case CARDS_LIST[1]:
      return {
        ...state,
        cardsList:actions.data
      }

    default:
      return state
  }
}
