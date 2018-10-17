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
      setLevel = ()=>{},
      billData = {},
      updateData = ()=>{}
    } = this.props;
    const { bill_type } = billData;
    return (
      <div style={styles.panel} onClick={(e)=>{
        e.preventDefault();
        e.stopPropagation()
        cancelFunc();
      }}>
        {
          level === 1?
            <div style={styles.container} onClick={(e)=>{
              e.preventDefault();
              e.stopPropagation();
            }}>
              {
                items.map((v,k)=>{
                  let {
                    action = ()=>{},
                    name = '',
                  } = v;

                  const isBlueObj = k<2?styles.blue:{}
                  const stylesObj = {
                    ...styles.item,
                    ...isBlueObj
                  }
                  const param = name=='manual'?(bill_type=='UNDONE'?{payStatus:'02'}:(
                    bill_type=='DONE'?{payStatus:'01'}:(bill_type == 'OVERDUEPAYMENT'?{payStatus:'01'}:{}))):{}
                  name = name=='manual'?(bill_type=='UNDONE'?"标记未还清":(
                    bill_type=='DONE'?'标记已还清':(bill_type == 'OVERDUEPAYMENT'?"标记已还清":name)
                  )):name
                  return <div style={stylesObj} onClick={()=>{action(param)}}>{name}</div>
                })
              }
              <div onClick={()=>{cancelFunc()}} style={styles.cancel}>取消</div>
            </div>:
            level === 2?
              <div style={styles.container} onClick={(e)=>{
                e.preventDefault();
                e.stopPropagation();
              }}>
                <div style={styles.header}>
                  <img src="/static/img/back.png" style={styles.back} onClick={()=>setLevel()}/>
                  标记还部分</div>
                <KeyWord billData={billData} apiCallback={()=>{updateData();cancelFunc()}} />
              </div>:null
        }
      </div>
    )
  }
}

const styles = {
  panel:{
    background: 'rgba(0, 0, 0, 0.5)',
    position: 'fixed',
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
    padding:'0 0.31rem',
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