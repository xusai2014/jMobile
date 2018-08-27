import React from 'react';
import Header from '../../compoents/Header'
import {connect} from "react-redux";
import {InitDecorator} from "../../compoents/InitDecorator";
import {getBankList, getEmailList} from '../../actions/reqAction';

@connect((state)=>{
 return {
   bankList:state.BillReducer.bankList,
 }
})
@InitDecorator()
export default class MethodList extends React.Component{
  async componentWillMount(){
    this.props.dispatch(getBankList()).then((result)=>{
      const { state ={} } = this.props.location;
      const { anchor ='' } = state;
      setTimeout(()=>{
        anchor && window.scrollTo(0,220)
      },1000)
    },(err)=>{
    });
  }

  async enterEmail(){
    this.props.dispatch(getEmailList({
    })).then((result)=>{
      const { data = [] }= result;
      if(data.length >0){
        this.props.history.push('/email/manager');
      } else {
        this.props.history.push('/email/add');
      }
    },(err)=>{

    });
  }

  componentDidMount(){

  }

  render(){
    const  { bankList = [] } = this.props;
    return [<Header key={'a'} title="添加账单" />,<div key={'b'} style={{
      background: '#FFFFFF',
      border: '1PX solid #DDDDDD'
    }}>
      {[{
        img:"/static/img/email@2x.png",
        name:"邮箱导入",
        des:"绑定账单后去邮箱，一键获取信用卡账单",
        action:"/email/manager",
        key:'email'
      },{
        img:"/static/img/shoushu@2x.png",
        name:"手输账单",
        des:"没有邮箱、网银账单？请手动输入账单",
        action:"/bill/cardlist",
        key:'cyber'
      }].map((v,k)=>{
        const { img, name, des,action, key} = v;
        return [<span key={'a1'}>{k==1?<div style={{
          border: '1PX solid #F1F1F1',
          width:'6.94rem',
          margin:'auto'
        }}></div>:null}</span>,<div key={k} onClick={()=>{

          if(key == 'cyber'){
            this.props.history.push(action)
          } else if(key == 'email'){
            this.enterEmail()
          }
        }}>
          <div style={{
            margin:"0.41rem 0.31rem 0.41rem 0.28rem",
            display:'inline-block',
          }}>
            <span style={{width:'0.6rem',height:'0.6rem',borderRadius:'0.3rem'}}><img src={img} style={{width:'0.6rem'}}/></span>
          </div>

          <div style={{display:'inline-block',margin:"0.41rem 0 0.41rem 0"}}>
            <div style={{
              fontSize: "0.24rem",
              color: '#333333',
              letterSpacing: '0',
            }}>{name}</div>
            <div style={{
              fontSize: '0.22rem',
              color: '#999999',
              letterSpacing: '0',
            }}>{des}</div>
          </div>

        </div>]
      })}
    </div>,<div key={'c'} id="cyberId" style={{
      fontSize: '0.24rem',
      color: '#999999',
      letterSpacing: '0',
      margin:'0.19rem 0 0.19rem 0.28rem'
    }}>网银导入，实时掌控账单情况</div>,<div>
      {
        bankList.map((v,k)=>{
          const {abbr, name, logo_uri} = v
          return [<div key={k} onClick={()=>this.props.history.push(`/cyber/login/${abbr}`,{name})} style={{background: '#FFFFFF',padding:"0.18rem 0 0.18rem 0.28rem",display:'flex', alignItems: 'center'}}>
            <span style={{width:'0.6rem',height:'0.6rem',borderRadius:'0.3rem'}}><img src={logo_uri} style={{width:'0.6rem',borderRadius:'0.3rem'}}/></span>
            <span style={{
              fontSize: '0.32rem',
              color: '#333333',
              letterSpacing: '0',
              fontWeight:"500",
              margin:"0 0 0 0.31rem"
            }}>{name}</span>
          </div>,<div key={'f'} style={{
            border: '1PX solid #F1F1F1',
            width:'6.94rem',
            margin:'auto'
          }}></div>]

        })
      }
    </div>]
  }
}