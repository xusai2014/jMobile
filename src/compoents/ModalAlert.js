/**
 * Create by chengkai on 2018/7/30.
 * Describe:
 */

import { Modal } from "antd-mobile";

export const showSingleBtnModal = ({
                                     title = '温馨提示',
                                     message = '',
                                     positiveBtnText = '确认',
                                     onOk = () => {}
                                   }) => {
  Modal.alert(title, message, [
    { text: positiveBtnText, onPress: onOk },
  ]);
}

export const showDoubleBtnModal = ({
                                     title = '温馨提示',
                                     message = '',
                                     onOk = () => {},
                                     onCancel = () => {},
                                     negativeBtnText = '取消',
                                     positiveBtnText = '确认',
                                   }) => {
  Modal.alert(title, message, [
    { text: negativeBtnText, onPress: onCancel },
    { text: positiveBtnText, onPress: onOk },
  ]);
}