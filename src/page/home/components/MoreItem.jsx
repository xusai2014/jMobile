import React from 'react';
import KeyWord from "./KeyWord";

export default class MoreItem extends React.Component {
  constructor(props){
    super(props);
    document.body.style.overflowY = 'hidden';
  }

  componentWillUnmount(){
    document.body.style.overflowY = '';
  }
  render(){
    const {
      items = [],
      cancelFunc = ()=>{},
      level = 1,
      setLevel = ()=>{}
    } = this.props;
    return (
      <div style={styles.panel}>
        {
          level === 1?
            <div style={styles.container}>
              {
                items.map((v,k)=>{
                  const {
                    action = ()=>{},
                    name = '',
                  } = v;
                  const isBlueObj = k<2?styles.blue:{}
                  const stylesObj = {
                    ...styles.item,
                    ...isBlueObj
                  }
                  return <div style={stylesObj} onClick={()=>{action()}}>{name}</div>
                })
              }
              <div onClick={()=>{cancelFunc()}} style={styles.cancel}>取消</div>
            </div>:
            level === 2?
              <div style={styles.container}>
                <div style={styles.header}>
                  <img src="/static/img/back.png" style={styles.back} onClick={()=>setLevel()}/>
                  标记还部分</div>
                <KeyWord />
              </div>:null
        }
      </div>
    )
  }
}

const styles = {
  panel:{
    background: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: '0',
    bottom: '0',
    width: '7.5rem'
  },
  container:{
    position: 'fixed',
    width: '7.5rem',
    bottom: '0',
    backgroundColor:'#FFFFFF',
    fontSize: '0.27rem'
  },
  item:{
    lineHeight:'0.88rem',
    textAlign:'center',
    borderBottom: '1PX solid #E5E5E5',
  },
  blue:{
    color:'#4C7BFE'
  },
  cancel:{
    textAlign:'center',
    lineHeight:'0.88rem',
    borderTop: '0.13rem solid #E5E5E5',
  },
  back:{
    width:"0.2rem",
    height:'0.34rem',
    marginLeft:'0.31rem',
    position: 'absolute',
    left: '0',
    top: '0.23rem'
  },
  header:{
    fontSize: '0.3rem',
    color: '#333333',
    letterSpacing: '0',
    width:'7.5rem',
    lineHeight:'0.8rem',
    textAlign:'center',
    border: '2px solid #ECECEC'
  },

}