import React from 'react';
import Header from "../../compoents/Header";
import {Icon, SwipeAction, List, Modal} from "antd-mobile";
import {InitDecorator} from "../../compoents/InitDecorator";
import {directImport, getEmailList, removeEmail} from "../../actions/reqAction";
import {Toast} from "antd-mobile";
import globalStyle from "../../style/globalStyle";

@InitDecorator((state)=>{
  return {
    emailList:state.BillReducer.emailList,
    requestStaus:state.GlobalReducer.requestStaus
  }
})
export default class EmailManager extends React.Component{

  async importEmailOne(taskId){
    Toast.loading('请稍后',0,null,true)
    if(this.props.requestStaus){
      return;
    }

    this.props.dispatch(directImport({
      taskId,
    })).then((result)=>{

      const { data:taskId = '' } =result;
      this.props.history.push('/load/email', {taskId, loginType: "03"})
      Toast.hide();
    },(err)=>{
      Toast.hide();
    });

  }

  componentWillUnmount(){
    promiseList.cancel()
  }

  async componentDidMount(){
    this.props.dispatch(getEmailList());

  }

  async removeEmailOne(uuid){
    this.props.dispatch(removeEmail({
      uuid,
    })).then(()=>{
      this.props.dispatch(getEmailList());
    });

  }
  render(){
    const {
      emailList
    } = this.props;
    return [
      <Header title="邮箱选择" right={(<Icon type="plus" onClick={()=>{this.props.history.push('/email/add')}}/>)}/>,
      <div>
        {
          emailList.map((v,k)=>{
            const {
              account,
              task_id,
              uuid = '',
              lastTime
            } = v;
            return<SwipeAction
              style={{ backgroundColor: 'gray' }}
              autoClose
              right={[
                {
                  text: '删除',
                  onPress: () => {
                      Modal.alert('', <span className="alert_content">确定删除邮箱</span>, [
                      { text: '取消', onPress: () => console.log('cancel'),style: globalStyle.cancelStyle},
                      { text: '确认', onPress: () => this.removeEmailOne(uuid),style: globalStyle.sureStyle },
                    ])
                  },
                  style: { width:"1.73rem",backgroundColor: '#FF2D55', color: 'white' },
                },
              ]}

              onOpen={() => console.log('global open')}
              onClose={() => console.log('global close')}

            >
              <List.Item
                arrow="horizontal"
                onClick={e => {
                  this.importEmailOne(task_id);
                }}
              ><div style={{
                fontSize: '0.31rem',
                color: '#333333',
                letterSpacing: '-1PX',
                margin:"0.2rem 0 0.01rem 0 "
              }}>{account}</div>
                <div style={{
                  fontSize: '0.24rem',
                  color: '#999999',
                  letterSpacing: '-0.77PX',
                  margin:"0 0 0.2rem 0 "
                }}>上次导入时间 {lastTime?lastTime:""}</div>
              </List.Item>
            </SwipeAction>
          })
        }
        <div style={{
          width:'7.5rem',
          margin:"0.4rem 0 0 0",
          textAlign:'center',
          fontSize: '0.24rem',
          color: '#999999',
          letterSpacing: '-0.77PX'
        }}>左滑可以删除邮箱</div>
      </div>
    ]
  }
}