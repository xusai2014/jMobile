import React from 'react';
import Header from "../../compoents/Header";
import {Icon, SwipeAction, List} from "antd-mobile";
import {InitDecorator} from "../../compoents/InitDecorator";
import {directImport, getEmailList, removeEmail} from "../../actions/reqAction";
import {Toast} from "antd-mobile";

@InitDecorator((state)=>{
  return {
    emailList:state.BillReducer.emailList
  }
})
export default class EmailManager extends React.Component{

  async importEmailOne(taskId){
    Toast.loading('请稍后')
    const reqParams = await this.props.getBaseParams();
    this.props.dispatch(directImport({
      ...reqParams,
      taskId,
    })).then((result)=>{
      const { data:taskId = '' } =result;
      Toast.hide();
      this.props.history.push('/load/email', {taskId, loginType: ""})
      debugger;
    },(err)=>{
      debugger;
    });

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
    }));

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
                  onPress: () => this.removeEmailOne(uuid),
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