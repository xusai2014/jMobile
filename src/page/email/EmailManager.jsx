import React from 'react';
import Header from "../../compoents/Header";
import {Icon, SwipeAction, List} from "antd-mobile";

export default class EmailManager extends React.Component{
  render(){
    return [
      <Header title="邮箱选择" right={(<Icon type="plus" onClick={()=>{this.props.history.push('/email/add')}}/>)}/>,
      <div>
        {
          [1,].map((v,k)=>{
            return<SwipeAction
              style={{ backgroundColor: 'gray' }}
              autoClose
              right={[
                {
                  text: '删除',
                  onPress: () => console.log('delete'),
                  style: { width:"1.73rem",backgroundColor: '#FF2D55', color: 'white' },
                },
              ]}

              onOpen={() => console.log('global open')}
              onClose={() => console.log('global close')}
            >
              <List.Item
                arrow="horizontal"
                onClick={e => console.log(e)}
              ><div style={{
                fontSize: '0.31rem',
                color: '#333333',
                letterSpacing: '-1PX',
                margin:"0.2rem 0 0.01rem 0 "
              }}>{'an881205@126.com'}</div>
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