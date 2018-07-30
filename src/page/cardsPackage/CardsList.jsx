import React from 'react';
import Header from "../../compoents/Header";
import Card from "./components/Card";

export default class CardsList extends React.Component{

  render(){
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
        {[1,2].map(()=>{
          return <Card ></Card>
        })}
      </div>
    </div>
  }
}