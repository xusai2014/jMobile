import React from 'react';

export default class InputRadio extends React.Component {
  constructor(props){
    super(props);

  }


  render() {
    const { activeOne, setActiveOne } = this.props;

    return [<div style={styles.container}>
      {
        ['本人卡','常用卡'].map((v,k)=>{
          return <div key={k}
                      onClick={()=>{setActiveOne(k)}}
                      style={{borderRight: k==0?'0.01rem solid #979797':'0',color:activeOne == k?'#4C7BFE':"#999999",...styles.blockOne}}>
            <img src={activeOne == k?"/static/img/Group@2x.png":"/static/img/Oval@2x.png"} style={styles.radio}/>
            <span>{v}</span>
          </div>
        })
      }
    </div>];
  }
}

const styles = {
  container: {
    background: '#FFFFFF', lineHeight: '0.55rem',width:'7.5rem',
  },
  radio: {
    width: "0.28rem",
    marginRight:'0.11rem',
    color: '#4C7BFE',
  },
  checkRadio: {
    width: "0.28rem",
    marginRight:'0.11rem',
    alignItems: 'center',
    display: 'inline-flex'
  },
  blockOne:{
    width:"3.745rem",
    margin:'0  0 0.3rem 0',
    fontSize: '0.31rem',
    letterSpacing: '0',
    textAlign:'center',
    alignItems: 'center',
    display: 'inline-flex',
    justifyContent: 'center',
  }
}