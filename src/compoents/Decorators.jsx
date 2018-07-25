import React from 'react';

/*
* 装饰器
* 设置头部
* */
export  const setTitle =(name)=>  (Wrapper)=>{
  return class extends React.Component{
    render() {
      return <div><Headers title={name}/><Wrapper {...this.props} /></div>
    }
  }
};

