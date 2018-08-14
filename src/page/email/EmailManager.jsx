import React from 'react';
import Header from "../../compoents/Header";
import {Icon, SwipeAction, List, Modal} from "antd-mobile";
import {InitDecorator} from "../../compoents/InitDecorator";
import {directImport, getEmailList, removeEmail} from "../../actions/reqAction";
import {Toast} from "antd-mobile";
const alert = Modal.alert;

@InitDecorator((state)=>{
  return {
    emailList:state.BillReducer.emailList,
    requestStaus:state.GlobalReducer.requestStaus
  }
})
export default class EmailManager extends React.Component{

  async importEmailOne(taskId){
    Toast.loading('请稍后')
    const reqParams = await this.props.getBaseParams();
    if(this.props.requestStaus){
      debugger;
      return;
    }
    await this.waitFunc(7000)

    this.props.dispatch(directImport({
      ...reqParams,
      taskId,
    })).then((result)=>{
      debugger;
      const { data:taskId = '' } =result;
      this.props.history.push('/load/email', {taskId, loginType: ""})
      Toast.hide();
    },(err)=>{
      debugger;
    });

  }

  componentWillUnmount(){
    promiseList.cancel()
  }

  waitFunc(time){
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        resolve()
      },time)
    })
  }

  async componentDidMount(){
    const reqParams = await this.props.getBaseParams();
    this.props.dispatch(getEmailList({
      ...reqParams,
    }));

  }

  async removeEmailOne(uuid){
    const reqParams = await this.props.getBaseParams();
    this.props.dispatch(removeEmail({
      ...reqParams,
      uuid,
    })).then(()=>{
      this.props.dispatch(getEmailList({
        ...reqParams,
      }));
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
              uuid = ''
            } = v;
            return<SwipeAction
              style={{ backgroundColor: 'gray' }}
              autoClose
              right={[
                {
                  text: '删除',
                  onPress: () => {
                    alert('', '账单删除后，如需再次查询，需要重新导入账单', [
                      { text: '确认', onPress: () => this.removeEmailOne(uuid) },
                      { text: '取消', onPress: () => console.log('cancel') },
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
                }}>上次导入时间 {'2018-07-15 11:05:48'}</div>
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