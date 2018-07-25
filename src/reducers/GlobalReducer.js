import {ASYNC_COOKIE, CLEAR_MSG, FORM_SET,SET_UUID} from '../utils/ActionsType';

const initialState = {
    loginToken: '',
    requestStaus: false,
    errMsg: '',
    formTemp: {},
    uuid: ''
};
//全局状态信息，数据信息存储
export default function (state = initialState, actions) {
    switch (actions.type) {
        case 'REQUEST':
            return {
                ...state,
                requestStaus: true,
            };
        case 'FINISH':
            return {
                ...state,
                requestStaus: false,
            }
        case 'FAILURE':
            return {
                ...state,
                errMsg: actions.error.err.message,
                requestStaus: false,
            };
        case ASYNC_COOKIE:

            return {
                ...state,
                ...actions.data,
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
