import React from 'react';
import {nativeRequestBaseParams} from "../interface/jsNative";
export const InitDecorator =  ()=>(Coms)=>{
  return class extends React.Component{
    constructor(props){
      debugger;
      super(props);
      this.state={
        reqParams :{}
      }
      this.resetParams();
    }

    resetParams(){
      nativeRequestBaseParams().then((reqParams)=>{
        this.setState({reqParams})
      })
    }
    render(){
      const { reqParams } = this.state;
      return <Coms reqParams={reqParams} resetParams={()=>this.resetParams()}/>
    }
  }
}