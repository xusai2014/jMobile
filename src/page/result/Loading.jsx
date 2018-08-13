import React from 'react';
import Header from "../../compoents/Header";
import { pollingCyber} from "../../actions/reqAction";
import {InitDecorator} from "../../compoents/InitDecorator";
import Loading from "../../compoents/Loading";
import { Toast } from 'antd-mobile';

const results = {
  cyber:{
    title:"网银账单"
  },
  email:{
    title:"邮箱账单"
  }

}

@InitDecorator((state) => ({
  loginList: state.BillReducer.loginList
}))
export default class LoadingStatus extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      progress:0
    }
  }

  /**
   *   @author jerryxu
   *   @params 用户信息
   *   @description 检查邮箱导入状态
   */

  async loopCheckAlways({ taskId,loginType }) {
    let pollingStatus = '';
    do {

      const reqParams = await this.props.getBaseParams();
      pollingStatus = await this.props.dispatch(pollingCyber({
        taskId,
        ...reqParams
      }));
      debugger;
      if(this.state.progress < 80){
        this.setState({
          progress:this.state.progress+10
        })
      }

    } while ( pollingStatus && typeof pollingStatus.data != 'undefined' && !pollingStatus.data)
    const {data} =pollingStatus
    debugger;
    if( typeof data == 'undefined'){
      Toast.info('导入失败',1)
      return;
    }
    this.setState({
      progress:100
    },()=>this.props.history.push('/result/cybersuccess'))

  }

  async componentWillMount(){
    const {
      state = {}
    } = this.props.location;
    debugger;
    const {
      taskId = "586b4860-9c76-11e8-89e7-00163e0dfac7",
    } = state;
    this.loopCheckAlways({
      taskId,
    });
  }
  render() {
    const  { type,}   = this.props.match.params;
    const { title } = results[type];
    const { progress } = this.state;
    return [<Header key="1" title={`正在导入${title}`} ></Header>,<div key={2} style={{width:"7.5rem",position:'absolute',textAlign:'center',backgroundColor:"#FFFFFF",paddingBottom:"0.5rem"}}>
      <Loading />
      {`正在导入${title}…已完成${progress}%`}
    </div>]
  }
}

const styles = {
  describe:{
    fontSize: "0.36rem",
    color: "#333333",
    letterSpacing: '-1PX',
    textAlign:'center',

  },
  resason:{
    fontSize: "0.24rem",
    color: '#999999',
    letterSpacing: '-0.67PX',
    textAlign: "center",
    margin:'0.3rem 1.53rem 0 1.53rem',
    width:'4.44rem'
  },finishBtn:{
    background:'#4C7BFE',
    boxShadow: '0 0.06rem 0.12rem 0 #9BB5FF',
    borderRadius: "0.08rem",
    margin:"1.4rem 0.16rem 0 0.16rem",
    lineHeight:"1.18rem",
    textAlign:'center',
    fontSize: "0.34rem",
    color: "#FFFFFF",
    letterSpacing: '-0.011rem',
  },
  actionReplace:{
    fontSize: "0.36rem",
    letterSpacing: "0",
    color: "#4C7BFE",
    textAlign:'center',
    marginTop:'1.21rem'
  },
  actionsImport:{
    fontSize: "0.36rem",
    letterSpacing: "0",
    color: "#4C7BFE",
    textAlign:'center',
    marginTop:'0.63rem',
    paddingBottom:"0.36rem"
  }
}