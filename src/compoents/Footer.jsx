import  React from 'react';
import {connect} from 'react-redux';
import styles from  './Footer.scss';
import {withRouter} from 'react-router-dom'
class Footer extends React.Component{
  componentWillMount(){
    this.state=({
      flag:false
    })
  }
  ChangeFlag(v){
    this.props.history.push(v.url)
  }
  render(){
    let {FooterConfig=[], type} = this.props
    return (<div className={styles.allContainer}>
        {
          FooterConfig&&FooterConfig.tab.map((v,k)=>{
            return(<div className={type?styles.item2:styles.item} key={k} onTouchStart={()=>{this.ChangeFlag(v)}}><div ><img className={styles.imgitem} src={window.location.pathname===v.url?v.icon2:v.icon1}/></div><div className={window.location.pathname===v.url?styles.titleitemAct:styles.titleitem}>{v.title}</div></div>)
          })
        }
      </div>)
  }
}
const mapStateToProps =(state)=>{
  return {
  }
}
const mapDispatchToProps = (dispatch)=>{
  return {
  }
};
export  default  withRouter(connect(mapStateToProps,mapDispatchToProps)(Footer));
