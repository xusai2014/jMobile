import React from 'react';
import Header from '../../compoents/Header';
import {Tabs} from "antd-mobile"
import Popup from "../home/components/Popup";

export default class BillDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expandOne: "-1",
      visible:false
    }

  }


  render() {
    const {title = '银行'} = this.props;
    const {expandOne, visible} = this.state;

    return [<Header title={title}
                    right={<img style={{width: "0.36rem",}} src="/static/img/删除@2x.png"/>}/>, <div>
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
        >韩胜臣 6226 **** **** 4128
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
            >10天后出账
            </div>
            <div style={{
              fontSize: '0.62rem',
              color: '#FFFFFF',
              letterSpacing: '0',
            }}>4074.65
            </div>
            <div style={{
              opacity: '0.5',
              fontSize: '0.24rem',
              color: '#FFFFFF',
              letterSpacing: '0',
            }}>最低应还：- -
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
            {[{
              title: "还款日", value: "08.26",
              unit: ""
            }, {
              title: "出账日", value: "08.08", unit: ""
            }, {
              title: "免息期", value: "28", unit: "天"
            }, {
              title: "总额度", value: "4.50", unit: "万"
            }, {
              title: "剩余额度", value: "2.68", unit: "万"
            }].map((v, k) => {
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
        >
          <div style={{background: '#FFFFFF',height:'auto'}}>
            {[1, 2].map((v, k) => {
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
                    }}><span>07-09</span>至<span>08-08</span></div>
                  </div>
                </div>
                {expandOne == v ? <div >
                  {
                    [1, 2, 3, 4].map((v, k) => {
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
                        }}>微信支付-广州唯品会电子商务有限公司
                        </div>
                        <div style={{
                          fontSize: '0.24rem',
                          color: '#999999',
                          letterSpacing: '0',
                        }}>06.25
                        </div>
                      </div><div style={{
                        fontSize: '0.32rem',
                        color: '#333333',
                        letterSpacing: '0',
                        display: 'inline-block',
                        width:"2.63rem",
                        textAlign:'right',
                        paddingRight:"0.4rem"
                      }}>-695.35</div></div>

                    })
                  }
                </div> : null}</div>
            })}
          </div>
          <div style={{background: '#FFFFFF'}}>{[1, 11, 11].map(() => {
            return [<div style={{height: '1.06rem', padding: '0.18rem 0', display: 'flex', alignItems: 'center'}}>
              <div style={{margin: '0 0 0 0.64rem', display: 'inline-block', width: '4.86rem'}}>
                <div style={{
                  fontSize: '0.26rem',
                  color: '#333333',
                  letterSpacing: '0',
                }}>还到还款
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
                -695.35
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
        }}><span style={{margin:'auto 0.13rem auto 0',height:'0.5rem'}}><img style={{height:'0.5rem'}} src="/static/img/更新@2x.png"/>
        </span>更新</div><div style={{
          fontSize: '0.36rem',
          color: '#FFFFFF',
          letterSpacing: '0',
          width:'3.51rem',
          display:'inline-flex',
          background: '#4C7BFE',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={()=>this.props.history.push('/manual/handlebill')}>立即还款</div>
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