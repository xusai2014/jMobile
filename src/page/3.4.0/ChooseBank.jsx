import React from 'react';
import styles from "./ChooseBank.less";
import Header from '../../compoents/Header';
import BankList from './components/BankList';
import { getBankList, getEchoForm } from "../../actions/reqAction";
import {InitDecorator} from "../../compoents/InitDecorator";

@InitDecorator((state) => {
    return {
        cardInfo: state.BillReducer.bankList,
    }
})
export default class ChooseBank extends React.Component {
    constructor(props) {
        super(props);
    }

    async componentWillMount() {
        this.props.dispatch(getBankList()).then((result) => {
        }, (err) => {
        });
    }

    chooseResult = () => {
        //TODO
        //跳转到对应银行的网银登录页
      this.props.dispatch(getEchoForm({bankName: abbr})).then((result) => {
        if (result) {
          const {data = []} = result
          data.map((v, k) => {
            const {
              bankLoginType,
              password,
              username,
              uuid,
            } = v;
            let [ nameVal,username1] = username.split(username.indexOf(','))
            this.setDeepState('inputData', bankLoginType, {
              username:nameVal,
              password,
              uuid,
              username1,
              echoStatus: true
            })
          })
        }
      }, (err) => {
      })
    }

    render() {
        const {cardInfo=[]} = this.props;
        const bankCards = cardInfo.map((v) => <BankList echoData={v} choose={this.chooseResult} key={v.logo_uri}/>)
        return (
            <div className={styles.container} style={{minHeight: gloablMinHeight}}>
                <Header key={'a'} title="选择银行"/>
                <div>
                    {bankCards}
                </div>
            </div>
        )
    }
}