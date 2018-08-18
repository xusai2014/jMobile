import React from 'react';
import Header from '../../compoents/Header';
import {Tabs,Modal,Toast} from "antd-mobile"
import Popup from "../home/components/Popup";
import {InitDecorator} from "../../compoents/InitDecorator";
import {
  checkToken, deleteBill, getBillDetail, getLoginList, getPayDetail, syncBill,
  verifyCode
} from "../../actions/reqAction";
import {waitFunc} from "../../utils/util";
const {operation,alert,prompt} = Modal;
@InitDecorator((state)=>{
  return {
    billDetail:state.BillReducer.billDetail,
    payDetail:state.BillReducer.payDetail
  }
})
export default class BillDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expandOne: "-1",
      visible:false,
      syncBegin:false,
      currentNum:'1',
      pageSize:'20',
      totalPages:'1',
    }
  }

  async callSyncBill(task_id, importBillType,abbr) {
    if(importBillType == '01'){

    } else {
      this.props.dispatch(getLoginList({
        abbr,
        cardType: 'CREDITCARD',
      })).then((result) => {
        const {data} = result;
        const {subtype = ''} = data;
        if (subtype) {
          alert('暂时无法获取账单的最新状态', <div>如果您已通过其导入它平台还款，建议您通过网银导入</div>, [
            {text: '暂不需要', onPress: () => console.log('置顶聊天被点击了'), },
            {text: '通过网银导入', onPress: () => this.props.history.push('/bill/method', {anchor: '#cyberId'}), }
          ]);
        } else {
          alert('该银行暂不支持同步您的账单数据', '', [
            {text: '我知道了', onPress: () => console.log('置顶聊天被点击了'), style: {textAlign: "center", paddingLeft: '0'}}
          ]);
        }

      }, (err) => {
      });

      return
    }

    await this.setState({
      syncBegin:true
    })
    this.props.dispatch(syncBill({
      taskId: task_id,
    })).then((result) => {
      const {data} = result;
      if(typeof data != 'undefined'){
        this.loopLogin(data, importBillType)
      }
    }, () => {

    })

  }

  /**
   *   @author jerryxu
   *   @params 用户信息
   *   @description 第二步流程 检查任务状态并获取任务状态
   */
  async loopLogin(taskId, loginType) {

    let status = {};
    do {
      await waitFunc(3000)
      status = await this.props.dispatch(checkToken({
        taskId,
      }))
    } while (this.judgeTaskStatus(status))
    this.handleStatus(status, taskId, loginType);
  }

  /**
   *   @author jerryxu
   *   @params 用户信息
   *   @description 第三步流程判断任务状态，分别处理
   */
  handleStatus(status, taskId, loginType) {
    const {data = {}} = status;
    const {phase, phase_status = '', input, description} = data;
    switch (phase_status) {
      case 'WAIT_CODE'://输入验证码

        return this.promptClick({
          input,
          description,
          taskId,
          callback: this.verifycation.bind(this)
        })
      case "DOING":
        return;
      case "DONE_SUCC"://成功登录
        this.setState({
          syncBegin:false
        })
        Toast.success('同步成功');
        return;
      case "DONE_FAIL":
        this.setState({
          syncBegin:false
        })
        Toast.info(description);
        return;
      case "DONE_TIMEOUT":
        this.setState({
          syncBegin:false
        })
        Toast.info('同步失败');
        return;
      default:
        this.setState({
          syncBegin:false
        })
        Toast.info('同步失败');
        return;
    }
  }


  /**
   *   @author jerryxu
   *   @methodName
   *   @params 任务编号 短信验证码
   *   @description 第三步流程的分支流程，输入验证码检查登录状态
   */
  async verifycation({taskId, value: code}) {
    let codeStatus = ''

    codeStatus = await this.props.dispatch(verifyCode({
      taskId,
      code,
    }));

    const {data} = codeStatus;
    //if(value == '200'){

    //} else {
    this.loopLogin(taskId);
    //}
  }

  /**
   *   @author jerryxu
   *   @methodName i
   *   @params 魔蝎验证码模版 任务编号 信息描述 回调函数
   *   @description Popup提示，输入信息，异步处理
   */
  promptClick({input, taskId, description, callback}) {
    prompt('输入验证码', description, [{
      text: '取消',
      onPress: value => new Promise((resolve) => {
        resolve();
      }),
    },
      {
        text: '确定',
        onPress: value => new Promise((resolve, reject) => {
          callback({taskId, value})
          resolve();
          // setTimeout(() => {
          //   this.setState({modal: true, description: "您绑定的卡为借记卡，卡包只支持绑定信用卡，请您重新绑定"})
          //   console.log(`value:${value}`);
          // }, 1000);
        }),
      },
    ], 'default', null, ['请输入验证码'])

  }

  judgeTaskStatus(status) {
    const {data} = status;
    const {phase, phase_status} = data;
    switch (phase_status) {
      case "DOING":
        return true;
      default:
        return false;
    }
  }

  judgeStatus(bill_type, payment_due_date, bill_date, action) {
    if (bill_type == 'DONE') {
      const duM = moment(payment_due_date);
      if (parseInt(duM.diff(moment(), 'days')) < 0) {
        return {
          day: " ",
          date: " ",
          des: `已逾期${moment().diff(duM, 'days')}天`,
          actionName: "立即还款",
          action
        }
      } else {
        return {
          day: duM.diff(moment(), 'days'),
          date: duM.format('MM-DD'),
          des: '天后到期',
          actionName: "立即还款",
          action
        }
      }
    } else if (bill_type == 'UNDONE') {
      const duM = moment(bill_date);
      return {
        day: duM.diff(moment(), 'days'),
        date: duM.format('MM-DD'),
        des: '天后到期',
        actionName: "更新未出",
        action
      }
    } else {
      return {
        day: "",
        date: '',
        des: '',
        actionName: "",
        action
      }
    }

  }

  async componentDidMount(){
    // TODO 账单明细的下拉加载
    const { billId } = this.props.match.params;
    const { currentNum, pageSize} = this.state;
    this.props.dispatch(getBillDetail({
      billId,
      currentNum,
      pageSize
    })).then((result)=>{
      const { data = {}} = result;
      const { pageResponseDto } = data;
      const {
        currentPage,
        size,
        totalPages,
      } = pageResponseDto;
      this.setState({
        currentNum:currentPage,
        pageSize:size,
        totalPages,
      })
    })
  }

  async getPayDetailInfo(bankId = '0308',cardNumber = '4443'){
    const { billDetail } =this.props;
    const {} = billDetail;
    this.props.dispatch(getPayDetail({
      bankId,
      cardNumber,
    }))
  }

  generate(payment_due_date,bill_date,credit_limit,balance){
    const payDate = payment_due_date ?moment(payment_due_date).format('MM.DD'):moment().format('MM.DD')
    const billDate = bill_date ?moment(bill_date).format('MM.DD'):moment().format('MM.DD');
    const  freeInterest = parseInt(moment(payment_due_date).diff(moment(),'days')) + parseInt(moment().daysInMonth())
    let amount= 0;
    let amountUnit = ''
    if(credit_limit%10000){
      amount =credit_limit/10000
      amountUnit= '万';
    } else if(credit_limit%1000){
      amount =credit_limit/1000;
      amountUnit= '千';
    }

    let ba= 0;
    let baUnit = ''
    if(credit_limit%10000){
      ba =credit_limit/10000
      baUnit= '万';
    } else if(credit_limit%1000){
      ba =credit_limit/1000;
      baUnit= '千';
    }
    return [{
      title: "还款日", value: payDate,
      unit: ""
    }, {
      title: "出账日", value: billDate, unit: ""
    }, {
      title: "免息期", value: freeInterest, unit: "天"
    }, {
      title: "总额度", value: amount, unit: amountUnit
    }, {
      title: "剩余额度", value: ba , unit: baUnit
    }]
  }



  haneleDetail(list){
    if(list.length == 0){
      return {
        from:'',
        to:'',
        datalist:[]
      }
    } else {
      const { trans_date:from } = list[0]
      const { trans_date:to }= list[list.length-1];
      return {
        from:moment(from).format('MM-DD'),
        to:moment(to).format('MM-DD'),
        datalist:_.values(list.map((v,k)=>{
          const { description,trans_date,amount_money } = v;
          return {
            description,
            trans_date:moment(trans_date).format('MM.DD'),amount_money
          }
        }))
      }
    }


  }

  judgeStatus(bill_type, payment_due_date, bill_date) {
    if (bill_type == 'DONE') {
      const duM = moment(payment_due_date);
      if(parseInt(duM.diff(moment(), 'days')) < 0){
        return {
          day: "",
          date: "",
          des:`已逾期${moment().diff(duM, 'days')}天`
        }
      } else {
        return {
          day: duM.diff(moment(), 'days'),
          date: duM.format('MM-DD'),
          des:'天后到期'
        }
      }
    } else if (bill_type == 'UNDONE') {
      const duM = moment(bill_date);
      return {
        day: duM.diff(moment(), 'days'),
        date: duM.format('MM-DD'),
        des:'天后到期'
      }
    } else {
      return {
        day: "",
        date: '',
        des:''
      }
    }

  }
  async removeBill(billId){
    this.props.dispatch(deleteBill({
      billId,
    })).then((result)=>{
      //TODO succeed to delete bill
      this.props.history.go(-1)
    })
  }

  render() {
    const {title = '银行',billDetail ={},payDetail= []} = this.props;
    const {expandOne, visible, syncBegin} = this.state;
    const {
      payment_due_date ,
      bill_date ,
      credit_limit = '',//总额度
      balance = '',//剩余额度
      pageResponseDto ={},//账单明细
      name_on_card = '',
      bill_type = '',
      min_payment = '',
      card_number = '',
      importBillType,
      abbr='',
      taskId,
      current_bill_amt = '0.00'
    } = billDetail;
    const { pageList:list = [],} = pageResponseDto
    const { billId } = this.props.match.params;

    const { from , to, datalist } = this.haneleDetail(list);
    const {day, date, des} = this.judgeStatus(bill_type, payment_due_date, bill_date)
    return [<Header title={title}
                    right={<img onClick={()=>{
                      alert('', '账单删除后，如需再次查询，需要重新导入账单', [
                        { text: '确认', onPress: () => this.removeBill(billId) },
                        { text: '取消', onPress: () => console.log('cancel') },
                      ])
                    }} style={{width: "0.36rem",}} src="/static/img/删除@2x.png"/>}/>, <div>
      <div style={{
        height: '2.95rem',
        width: '7.5rem',
        backgroundImage: 'linear-gradient(-269deg, #7576FF 6%, #5E84FE 98%)',
      }}>
        <div
          style={{
            fontSize: '0.31rem',
            color: '#FFFFFF',
            letterSpacing: '0',
            padding: '0.27rem 0 0 0.31rem'
          }}
        >{name_on_card} {card_number}
        </div>
        <div style={{paddingBottom: "0.38rem"}}>
          <div style={{width: "5rem", padding: '0.43rem 0 0 0.31rem', display: 'inline-block'}}>
            <div
              style={{
                opacity: '0.5',
                fontSize: '0.24rem',
                color: '#FFFFFF',
                letterSpacing: '0',
              }}
            >{day}{des}
            </div>
            <div style={{
              fontSize: '0.62rem',
              color: '#FFFFFF',
              letterSpacing: '0',
            }}>{current_bill_amt}
            </div>
            <div style={{
              opacity: '0.5',
              fontSize: '0.24rem',
              color: '#FFFFFF',
              letterSpacing: '0',
            }}>最低应还：{min_payment}
            </div>
          </div>
          <div style={{
            opacity: '0.5',
            fontSize: '0.24rem',
            color: '#FFFFFF',
            letterSpacing: '0',
            textAlign: 'right',
            display: 'inline-block'
          }}>
            {this.generate(payment_due_date,bill_date,credit_limit, balance).map((v, k) => {
              const {title, value, unit} = v;
              return <div>
                <span>{title}：</span><span>{value}</span><span>{unit}</span>
              </div>
            })}
          </div>
        </div>
        <div style={{height:'auto'}}>
        <Tabs
          tabs={[
            {title: '账单明细', sub: '0'},
            {title: '还款记录', sub: '1'},
          ]}
          initialPage={0}
          onTabClick={(v)=>{
            const { sub} = v
              if(sub == '1'){
                this.getPayDetailInfo()
              }
            }
          }
        >
          <div style={{background: '#FFFFFF',height:'auto'}}>
            {[1].map((v, k) => {
              return <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.16rem 0'
                }}>
                  <img style={{
                    width: '0.19rem',
                    margin: '0 0.17rem 0 0.28rem',
                    height: '0.132rem',
                  }} src={expandOne == v ? "/static/img/triangleup@2x.png" : "/static/img/triangle@2x.png"}
                       onClick={() => {
                         if (v == expandOne) {
                           this.setState({expandOne: '-1'})
                         } else {
                           this.setState({expandOne: v})
                         }

                       }}/>
                  <div style={{display: 'inline-block'}}>
                    <div style={{
                      fontSize: '0.26rem',
                      color: '#4C7BFE',
                      letterSpacing: '0',
                    }}>未出账单
                    </div>
                    <div style={{
                      fontSize: '0.24rem',
                      color: '#999999',
                      letterSpacing: '0'
                    }}><span>{from}</span>至<span>{to}</span></div>
                  </div>
                </div>
                {expandOne == v ? <div >
                  {
                    list.map((v, k) => {
                      const { description,trans_date,amount_money } = v;
                      return <div style={{
                        display:'flex',
                        alignItems:'center'
                      }}><div style={{
                        padding: '0.18rem 0 0.18rem 0.64rem',
                        display: 'inline-block'
                      }}>
                        <div style={{
                          fontSize: '0.24rem',
                          color: '#333333',
                          letterSpacing: '0',
                          width:"4.23rem"
                        }}>{description}
                        </div>
                        <div style={{
                          fontSize: '0.24rem',
                          color: '#999999',
                          letterSpacing: '0',
                        }}>{trans_date}
                        </div>
                      </div><div style={{
                        fontSize: '0.32rem',
                        color: '#333333',
                        letterSpacing: '0',
                        display: 'inline-block',
                        width:"2.63rem",
                        textAlign:'right',
                        paddingRight:"0.4rem"
                      }}>-{amount_money}</div></div>

                    })
                  }
                </div> : null}</div>
            })}
          </div>
          <div style={{background: '#FFFFFF'}}>{payDetail.map((v,k) => {
            const {createTime,repaymentAmount,repaymentTime,repaymentChannel} =v;
            const {} = repaymentTime;
            return [<div style={{height: '1.06rem', padding: '0.18rem 0', display: 'flex', alignItems: 'center'}}>
              <div style={{margin: '0 0 0 0.64rem', display: 'inline-block', width: '4.86rem'}}>
                <div style={{
                  fontSize: '0.26rem',
                  color: '#333333',
                  letterSpacing: '0',
                }}>{
                  repaymentChannel =='01'?'还到':""
                }还款
                </div>
                <div style={{
                  color: '#999999',
                  fontSize: "0.24rem",
                }}>2018-07-09 09:21
                </div>
              </div>
              <div style={{
                fontSize: '0.32rem',
                color: '#333333',
                letterSpacing: '0',
                display: 'inline-block',
                width: '2rem',
                textAlign: "right",
                padding: "0 0.26rem 0 0"
              }}>
                +{repaymentAmount}
              </div>
            </div>, <div style={{width: "6.94rem", margin: 'auto', border: '1PX solid #F1F1F1'}}></div>]
          })}</div>
        </Tabs>
        </div>
        <div style={{display: 'flex',position: 'fixed',bottom: '0'}}>
          <div style={{
            width:'0.58rem',
            height:"1.02rem",
            opacity: '0.24',
            background: '#4C7BFE',
            display:'inline-block'
          }}></div><div style={{
          fontSize: '0.36rem',
          color: '#333333',
          letterSpacing: '0',
          padding:'0 0.67rem',
          display:'inline-flex',
          alignItems:'center',
          background: '#FFFFFF',
          height: '1.02rem',
          width:'2.17rem'
        }} onClick={()=>this.callSyncBill(taskId,importBillType,abbr)}><span style={{margin:'auto 0.13rem auto 0',height:'0.5rem'}}>
          <style>{
          `@-webkit-keyframes rotation{
            from {-webkit-transform: rotate(0deg);}
            to {-webkit-transform: rotate(360deg);}
           }

           .Rotation{
            -webkit-transform: rotate(360deg);
            animation: rotation 3s linear infinite;
            -moz-animation: rotation 3s linear infinite;
            -webkit-animation: rotation 3s linear infinite;
            -o-animation: rotation 3s linear infinite;
           }
           `
          }</style>
          <img className={syncBegin?"Rotation":""} style={{height:'0.5rem',}} src="/static/img/更新@2x.png"/>
        </span>更新</div><div style={{
          fontSize: '0.36rem',
          color: '#FFFFFF',
          letterSpacing: '0',
          width:'3.51rem',
          display:'inline-flex',
          background: '#4C7BFE',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={()=>this.setState({visible:true})}>立即还款</div>
        </div>

      </div>
    </div>,visible?<Popup style={{top:'0.81rem'}} title="选择还款方式"  data={
      [
        {imgSrc:"/static/img/还@2x.png",name:'还到',action:"",type:'0',des:'（授信额度30000元）',color:'#4d7cfe'},
        {imgSrc:"/static/img/qita@2x.png",name:'其它',action:"",type:'1',des:'',color:'',node:[
          {imgSrc:"/static/img/微信@2x.png",name:'微信',action:"",type:'0',des:'',color:''},
          {imgSrc:"/static/img/支付宝@2x.png",name:'支付宝',action:"",type:'0',des:'',color:''}
        ]},
      ]
    } visible={visible} setVisible={(v)=>{this.setState({visible:v})}}
    />:null];
  }
}