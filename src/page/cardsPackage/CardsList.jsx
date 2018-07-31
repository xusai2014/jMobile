import React from 'react';
import Header from "../../compoents/Header";
import Card from "./components/Card";
import {Menu} from "antd-mobile";

const method = [
  {
    value: '1',
    label: '手写账单',
  }, {
    value: '2',
    label: '查看账单',
  },
];


export default class CardsList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      activeCard:-1,// -1不选择，其它值选择
    };
  }

  render(){
    const { activeCard } = this.state;
    return <div>
      <Header title="卡包" hide={false}/>
      <div style={{
        background: "#F0F7FF",
        lineHeight:'0.68rem',
        display:'flex',
        justifyContent:'center',
      }}>
        <div>
          <img src="/static/img/信用卡@2x.png" style={{width:"0.3rem"}}/>
          <span style={{margin:'0.08rem',fontSize:'0.24rem',color:'#4C7BFE',letterSpacing:'0'}}>
          办信用卡
        </span>
          <img src="/static/img/Path 3@2x.png" style={{width:"0.1rem"}}/>
        </div>
      </div>
      <div>
        {[1,2].map(( v,k)=>{
          return <Card id={k} key={k} popupCard={(v)=>this.setState({activeCard:parseInt(v)})}></Card>
        })}
      </div>

      {
        activeCard > -1?[
          <style>{`
        .single-foo-menu {
          position: absolute;
          z-index: 90 !important;
          width: 100%;
          position:absolute;
          bottom:0;
        }

        .single-menu-active .single-top-nav-bar{
          z-index: 90;
        }

        .single-top-nav-bar {
          position: relative;
          background-color: #008AE6;
          color: #FFF;
        }
        .am-navbar-title {
          color: #FFF!important;
        }
        .menu-mask {
          position: absolute;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: #000;
          opacity: 0.4;
          z-index: 89;
        }
        .am-menu .am-flexbox .am-flexbox-item:first-child .am-list .am-list-item .am-list-line .am-list-content{
          text-align:center;
        }
      `}</style>, <Menu
            className="single-foo-menu"
            data={method}
            level={1}
            height={document.documentElement.clientHeight / 6}
            onChange={()=>{
              this.props.history.push('/')
            }}
            multiSelect={false}
          />,
          <div className="menu-mask" onClick={()=>{this.setState({activeCard:-1,})}}  />
        ]:null
      }

    </div>
  }
}