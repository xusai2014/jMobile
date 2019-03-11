import React, { Component } from 'react';
import Header from '../../compoents/Header';
import styles from './ExchangeRecord.less';
import NoteItem from './components/NoteItem';

export default class ExchangeRecord extends Component {
  state = {
  }
  componentDidMount() {
  }
  checkDetails = () => {
    this.props.history.push('/myapp/orderDetails');
  }
  render() {
    const { sourceData = [
      { name : '30元刷卡金', bankName : '招商银行', time : '2018-08-25', status : '成功', number : '3000' },
      { name : '30元刷卡金', bankName : '招商银行', time : '2018-08-25', status : '失败', number : '3000' },
      { name : '30元刷卡金', bankName : '招商银行', time : '2018-08-25', status : '审核中', number : '3000' },
    ]} = this.props;
    const noteItems = sourceData.map((v,k)=>{
      return <NoteItem echoData={v} key={k} checkDetails={this.checkDetails} />;
    })
    return (
      <div className={styles.container}>
        <Header title="兑换记录" />
        {noteItems}
        <div className={styles.noMore}>
          没有更多了...
        </div>
      </div>
    );
  }
}

