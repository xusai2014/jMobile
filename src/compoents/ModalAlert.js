// @flow
/**
 * Create by xusai
 * Describe:
 */
import React from 'react';
import { Modal } from 'antd-mobile';
import globalStyle from '../style/globalStyle';

type AlertParams = {
  title: string,
  rightFunc: Function,
  leftText?: string,
  description?: string,
  rightText?: string,
  leftFunc?: Function,
}

export default function ModalAlert(alertParams: AlertParams): void {
  const {
    title = '',
    leftText = '',
    rightText = '',
    leftFunc = '',
    rightFunc,
    description
  } = alertParams;
  const actions = [];
  if (leftText) {
    actions.push({
      text: leftText,
      onPress: leftFunc && leftFunc(),
      style: globalStyle.cancelStyle
    });
  }
  if (rightText) {
    actions.push({
      text: rightText,
      onPress: rightFunc(),
      style: globalStyle.sureStyle
    });
  }

  Modal.alert(
    <span className="alert_title">{title}</span>,
    description, actions
  );
}
