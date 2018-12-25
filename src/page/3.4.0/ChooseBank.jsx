import React from 'react';
import styles from "./ChooseBank.less";
import Header from '../../compoents/Header';
import BankList from './components/BankList';
import {getBankList} from "../../actions/reqAction";
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