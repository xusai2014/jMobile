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
          return [<div key={k}
                      onClick={()=>{setActiveOne(k)}}
                      style={{color:activeOne == k?'#4C7BFE':"#999999",...styles.blockOne}}>
            <img src={activeOne == k?"/static/img/Group@2x.png":"/static/img/Oval@2x.png"} style={styles.radio}/>
            <span>{v}</span>
          </div>,k==0?<div style={{
            width: '1PX',
            backgroundColor:'rgb(151, 151, 151)',
            height: '0.55rem',
            margin: '0 0.9rem'
          }}></div>:null]
        })
      }
    </div>];
  }
}

const styles = {
  container: {
    background: '#FFFFFF', lineHeight: '0.55rem',width:'7.5rem',
    display: 'flex',justifyContent: 'center'
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
    margin:'0  0 0.3rem 0',
    fontSize: '0.31rem',
    letterSpacing: '0',
    textAlign:'center',
    alignItems: 'center',
    display: 'inline-flex',
    justifyContent: 'center',
  }
}