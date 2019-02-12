import React, { Component } from 'react';
import Header from '../../compoents/Header';

export default class NoRecord extends Component {
  state = {
  }
  componentDidMount() {
  }

  render() {
    return (
      <div style={{ width: '100%' }}>
        <Header title="兑换记录" />
        <div style={{ fontFamily: 'PingFangSC-Regular',
          fontSize: '0.24rem',
          color: '#999999',
          letterSpacing: 0,
          marginLeft: '2.91rem',
          marginTop: '2.62rem' }}
        >
          暂无兑换记录~
        </div>
      </div>
    );
  }
}

