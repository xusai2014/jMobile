import React from 'react';
import {Modal, Icon} from 'antd-mobile'
import BillCard from "./BillCard";
import Popup from "./components/Popup";
import { InitDecorator } from "../../compoents/InitDecorator";

@InitDecorator()
export default class Index extends React.Component {
  constructor(props) {
    super(props);
    debugger;
    this.state = {
      interestShow: false, //免息期弹窗展示,
      visible:false,//弹出框
    }
    const x = (param)=>new Promise((resolve,reject)=>{
      setTimeout(()=>{
        if(param >10){
          resolve({data:true})
        } else {
          reject({data:false})
        }

      },10)
    });
    function*  getr() {
      try {
        const r1 = yield x(12);
        console.log("yield",r1);
        const r2 = yield x(6);
        console.log("yield",r2);
        const r3 = yield x(18);
        console.log("yield",r3);
      } catch(w) {
        console.log(w)
      }
    }
    function*  getHome() {
      try {
        const r1 = yield x(11);
        console.log(11,r1);
        const r2 = yield x(5).then(()=>{
          debugger;
          console.log('111111111')
        },()=>{
          debugger;
          throw Error('fsdfds')
          console.log('222222222')
        });
        const r3 = yield* getr();
        console.log('generator',r3);
        const r4 = yield x(11);
      } catch(w) {
        console.log(w)
      }
    }

    function run(generator){
      var it = generator();

      function go(result){
        if(result.done) {
          // console.log(result.value);
          return result.value;
        }
        return result.value.then(function(value){
          return go(it.next(value));
        },function(error){
          return go(it.throw(error));
        });
      }

      go(it.next());
    }
    run(getHome)

    function* setHome() {
      yield 1;
      yield 2;
      yield 3;
    }
    const u = setHome();
    u.next();
    u.next();
    u.next();

  }

  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  }

  render() {
    const {interestShow, visible} = this.state;
    return [<div style={{background: '#FFFFFF', paddingBottom: "0.7rem"}}>
      <div style={styles.top}>
        <div style={styles.topText}>7日内待还<span style={styles.topSubText}>{'0'}笔</span></div>
        <img onClick={()=>{this.setState({interestShow:true})}} style={styles.img} src="/static/img/canlendar@2x.png"/>
        <span onClick={()=>{this.props.history.push('/bill/method')}} style={styles.icon}><Icon type="plus" size="sm" color="#000"/></span>
      </div>
      <div style={{marginTop: "0.19rem"}}>
          <span style={{
            fontSize: '0.52rem',
            color: '#333333',
            letterSpacing: '0',
            textAlign: 'center',
            marginLeft: '0.26rem',
            fontWeight: 'bold'
          }}>{18889.00}<span style={{
            fontSize: '0.26rem',
            color: '#333333',
            letterSpacing: '0',
            textAlign: 'center',
            marginLeft: "0.045rem"
          }}>元</span></span></div>
      <div style={styles.cover}>
        {
          [{img: "/static/img/kabao@2x.png", text: "卡包",action:"/cards/cardslist",type:"0"}, {img: "/static/img/banka@2x.png", text: "办卡",action:"https://www.baidu.com",type:'1'}].map((v, k) => {
            const {img, text, action, type} = v
            return <div>
              <span style={{margin: "0.32rem 0 0 0", display: 'inline-block'}} onClick={()=>{
                  if(type == '0'){
                    this.props.history.push(action)
                  } else if(type =='1'){
                    window.location.href = action;
                  }
                }}>
                <img src={img} style={{width: '0.65rem'}}/>
              </span>
              <div style={{fontSize: '0.3rem', color: '#FFFFFF', letterSpacing: '0', textAlign: 'center'}}>
                {text}
              </div>
            </div>
          })
        }
      </div>
      <div style={{display:"flex",justifyContent:"space-around",marginTop:"0.49rem"}}>{
        [{
          imgSrc:'/static/img/img_5049@2x.png',
          action:"",
          title:"等你抽奖"
        },{
          imgSrc:'/static/img/img_5050@2x.png',
          action:"",
          title:"我的红包"
        },{
          imgSrc:'/static/img/img_5051@2x.png',
          action:"",
          title:"免息35天"
        },{
          imgSrc:'/static/img/img_5052@2x.png',
          action:"",
          title:"挖金币"
        }].map((v,k)=>{
          const { imgSrc, action, title} = v;
          return <div style={{display:"inline-block"}}><img style={{width:'0.74rem'}} src={imgSrc} /><div>{title}</div></div>
        })
      }</div>
    </div>,<div>
      {
        [1].map(()=>{
          return <BillCard repay={()=>this.setState({visible:true})} />
        })
      }
    </div>,
      <div style={{
        display: 'flex',justifyContent: 'center',alignItems: 'center',
        background: '#FFFFFF', height:'0.84rem',widht:'7.5rem',margin:"0.2rem 0 0 0"}}
        onClick={()=>this.props.history.push('/bill/method')}
      >
        <Icon  type="plus" color="#999999" size="xs"/>
        <span style={{
          fontSize: '0.28rem',
          color: '#999999',
          letterSpacing: '0',
          textAlign: 'center',
          marginLeft:'0.08rem'
        }}>添加信用卡账单</span>

      </div>,
      <Modal
        visible={interestShow}
        transparent
        maskClosable={false}
        onClose={() => this.setState({interestShow: false})}
        title={<div style={{textAlign:'left'}}>最长免息期</div>}
        wrapProps={{onTouchStart: this.onWrapTouchStart}}
        closable={true}
      >
        <div style={{height: '5.03rem', overflow: 'scroll'}}>
          {
            [{
              imgSrc:"/static/img/交通银行@2x.png",
              title:"交通银行",
              des:"总额度1万元|剩余额度0.00",
              cardNum:"9178"
            },{
              imgSrc:"/static/img/jianshe@2x.png",
              title:"建设银行",
              des:"总额度1万元|剩余额度0.00",
              cardNum:"9178"
            },{
              imgSrc:"/static/img/交通银行@2x.png",
              title:"交通银行",
              des:"总额度1万元|剩余额度0.00",
              cardNum:"9178"
            },{
              imgSrc:"/static/img/jianshe@2x.png",
              title:"建设银行",
              des:"总额度1万元|剩余额度0.00",
              cardNum:"9178"
            },{
              imgSrc:"/static/img/交通银行@2x.png",
              title:"交通银行",
              des:"总额度1万元|剩余额度0.00",
              cardNum:"9178"
            },{
              imgSrc:"/static/img/jianshe@2x.png",
              title:"建设银行",
              des:"总额度1万元|剩余额度0.00",
              cardNum:"9178"
            },].map((v,k)=>{
              const { imgSrc, title, des, cardNum} = v;
              return (<div style={{textAlign:'left',margin:"0.23rem 0"}}>
                <span style={{width:'0.6rem',borderRadius:'0.3rem'}}>
                  <img style={{width:'0.6rem'}} src={imgSrc}/>
                </span>
                <div style={{display:"inline-block",margin:"0 0 0 0.14rem"}}>
                  <div style={{
                    fontSize:'0.24rem',
                    color: '#333333',
                    textAlign:'left',
                    letterSpacing: '0',
                  }}>{title}({cardNum})</div>
                <div style={{
                  fontSize: '0.2rem',
                  color: '#999999',
                  letterSpacing: '0',
                }}>{des}</div>
                </div>
              </div>)
            })
          }
        </div>
      </Modal>

    ,visible?<Popup title="选择还款方式"  data={
          [
            {imgSrc:"/static/img/还@2x.png",name:'还到',action:"",type:'0',des:'（授信额度30000元）',color:'#4d7cfe'},
            {imgSrc:"/static/img/qita@2x.png",name:'其它',action:"",type:'1',des:'',color:'',node:[
              {imgSrc:"/static/img/微信@2x.png",name:'微信',action:"",type:'0',des:'',color:''},
              {imgSrc:"/static/img/支付宝@2x.png",name:'支付宝',action:"",type:'0',des:'',color:''}
            ]},
          ]
        } visible={visible} setVisible={(v)=>{this.setState({visible:v})}}
      />:null
    ]
  }

}

const styles = {
  container: {},
  topText: {
    fontSize: '0.3rem',
    color: '#999999',
    letterSpacing: "0",
    margin: '0.38rem 0 0 0.26rem',
    display: 'inline-block'
  },
  img: {
    width: '0.33rem',
    margin: '0.38rem 0.48rem 0 3.725rem '
  },
  topSubText: {
    color: '#151515',
    textAlign: 'center',
    lineHeight: '0.42rem',
    marginLeft: '0.1rem',
  },
  top: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    margin: '0.38rem 0 0 0 '
  },
  cover: {
    backgroundImage: 'linear-gradient(-141deg, #5E86FF 6%, #564CFE 88%)',
    borderRadius: '0.2rem',
    width: '6.94rem',
    height: '1.84rem',
    margin: '0.26rem auto 0 auto',
    display: 'flex',
    justifyContent: 'space-around'
  }
}

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}