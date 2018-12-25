import React from 'react';
import styles from "./ChooseBank.less";
import Header from '../../compoents/Header';
import BankList from './components/BankList';
import {getBankList} from "../../actions/reqAction";
import {InitDecorator} from "../../compoents/InitDecorator";

@InitDecorator((state) => {
    return {
        cardInfo: state.BillReducer.getBankList,
    }
})
export default class ChooseBank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardInfo: [],
        }
    }

    async componentWillMount() {
        this.props.dispatch(getBankList()).then((result) => {
            this.setState({
                cardInfo: result.data[0].bank_list,
            })
        }, (err) => {
        });
    }

    chooseResult = () => {
        //TODO
        this.props.history.push({pathname: "/3.4.0/importbills", query: {}});//返回并且携带数据
    }

    render() {
        const {cardInfo} = this.state;
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