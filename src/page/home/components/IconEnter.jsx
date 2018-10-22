import React from 'react';
export default (props)=>{
  const { action,des,icon} = props;
  return (
    <div style={styles.container} onClick={() => {
      action()
    }}>
      <img  style={styles.img} src={icon}/>
      <span style={styles.des}>{des}</span>
    </div>
  )
}

const styles = {
  container:{
    background: '#F2F2F2',
    borderRadius: '1rem',
    width:'1.42rem',
    height:'0.53rem',
    display: 'flex',
    alignItems: 'center'
  },
  img: {
    width: '0.2rem',
    height: '0.22rem',
    marginLeft:'0.19rem'
  },
  des:{
    fontSize: '0.24rem',
    color: '#333333',
    letterSpacing: '0',
    marginLeft:'0.12rem'
  }
}