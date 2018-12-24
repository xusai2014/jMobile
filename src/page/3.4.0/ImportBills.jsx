import React from 'react';
import Header from '../../compoents/Header';
import PayMethodList from './components/PayMethodList';
import CardList from './components/CardList';
import AllCount from './components/AllCount';
import styles  from './ImportBills.less';

// import {InitDecorator} from "../../compoents/InitDecorator";
// import {getBankList, getEmailList} from '../../actions/reqAction';

// @InitDecorator((state)=>{
//     return {
//         bankList:state.BillReducer.bankList,
//     }
// })

export default class ImportBills extends React.Component {

    render() {
        const {echoData=[],cardInfo=[],allCountData={}}=this.props;
        const {
            sourceData = [{
                img : "/static/img/email@2x.png",
                name : "邮箱导入",
                describe : "绑定账单后去邮箱，一键获取信用卡账单",
                path :""
            }, {
                img : "/static/img/shoushu@2x.png",
                name : "手输账单",
                describe : "没有邮箱，网银账单？请手动输入账单",
                path :""
            }]
        } = echoData;
        const {cardData=[{img : "/static/img/3.4.0/zs@2x.png",describe:'招商银行'
        },{img : "/static/img/3.4.0/zx@2x.png",describe:'中信银行'
        },{img : "/static/img/3.4.0/js@2x.png",describe:'建设银行'
        },{img : "/static/img/3.4.0/pa@2x.png",describe:'平安银行'
        },{img : "/static/img/3.4.0/gs@2x.png",describe:'工商银行'
        },{img : "/static/img/3.4.0/zg@2x.png",describe:'中国银行'
        },{img : "/static/img/3.4.0/ny@2x.png",describe:'农业银行'
        },{img : "/static/img/3.4.0/jt@2x.png",describe:'交通银行'
        }]}=cardInfo;
        const {allCountList={email:'an****01@163.com',des:'全部账号'}}=allCountData;
        const cardList=cardData.map((v,k)=>{
            if((k+1)%3==0) {
                return (<CardList echoData={v} key={v.img} noMarginRight={true}/>)
            }
            else {
                return (<CardList echoData={v} key={v.img} noMarginRight={false}/>)
            }
        })
        return (
            <div className={styles.container}  style={{minHeight: gloablMinHeight}}>
                <Header key={'a'} title="添加账单"/>
                <PayMethodList echoData={sourceData[0]}/>
                <AllCount echoData={allCountList}/>
                <PayMethodList echoData={sourceData[1]}/>
                <div className={styles.margin}></div>
                <div className={styles.Content}>
                    <div className={styles.text}>
                        <span className={styles.contentName}>
                        通过网银查询账单
                        </span>
                        <span className={styles.contentDescribe}>
                            实时获取账单、额度、消费明细、积分信息
                        </span>
                    </div>
                    <img src="/static/img/3.4.0/goNext.png"/>
                </div>
                <div className={styles.cardList}>
                    <div className={styles.firstLine}>
                        {cardList}
                    </div>
                </div>
            </div>
          )

    }
}