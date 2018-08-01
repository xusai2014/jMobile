import React from 'react';
import {Icon} from "antd-mobile";

export default class Popup extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      type:'0',
      selectData:[]
    }
  }

  renderList(){
    const {type,selectData} = this.state;
    const { data } = this.props;
    switch(type) {
      case '0':
        return data.map((v,k)=>{
          const {imgSrc, name, des, type,color, node} = v;
          return [<div style={{
            display: 'flex',
            alignItems: 'center',

          }}  onClick={()=>{
            if(type == '0'){

            } else if(type == '1'){
              this.setState({type,selectData:node})
            }
          }}>
            <img src={imgSrc} style={{margin:"0.3rem 0.26rem 0.31rem 0.28rem",width:'0.45rem'}}/>
            <span style={{
              fontSize: '0.32rem',
              color: '#333333',
            }} >{name}</span><span style={{
            fontSize: '0.32rem',
            color: color,
          }} >{des}</span>
          </div>,<div style={{
            border: '1PX solid #F1F1F1',
            width:'6.94rem',
            margin:'auto'
          }}></div>]
        })
      case '1':
        return selectData.map((v,k)=>{
          const {imgSrc, name, des, type,color, node} = v;
          return [<div style={{
            display: 'flex',
            alignItems: 'center',

          }}  onClick={()=>{
            if(type == '0'){

            } else if(type == '1'){
              this.setState({type,selectData:node})
            }
          }}>
            <img src={imgSrc} style={{margin:"0.3rem 0.26rem 0.31rem 0.28rem",width:'0.45rem'}}/>
            <span style={{
              fontSize: '0.32rem',
              color: '#333333',
            }} >{name}</span><span style={{
            fontSize: '0.32rem',
            color: color,
          }} >{des}</span>
          </div>,<div style={{
            border: '1PX solid #F1F1F1',
            width:'6.94rem',
            margin:'auto'
          }}></div>]
        })

    }

  }
  render(){
    const { visible, setVisible, title = '选择还款方式', data } = this.props;
    return <div style={{
      position:'absolute',
      top: '0',
      width:'7.5rem',
      height:window.screen.availHeight,
      background: 'rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{
        position: 'absolute',
        bottom: '0',
        background: '#fff',
        width: '7.5rem',
        height:'4.29rem',
      }}>
        <div style={{
          fontSize: '0.36rem',
          color: '#333333',
          letterSpacing: '0',
          margin:"0.31rem 0 0.19rem 0",
          textAlign: 'center'
        }}><span>{title}</span> <span style={{
          float: 'right',
          marginRight: '0.3rem'
          }} onClick={()=>{this.props.setVisible(false)}}
        ><Icon type="cross" size="md" color="#000"/></span></div>
        <div style={{
          border: '1PX solid #F1F1F1',
          width:'6.94rem',
          margin:'auto'
        }}></div>
        {
          this.renderList()
        }
      </div>

      </div>
  }
}