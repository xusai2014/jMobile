import React from 'react';
import NoMatch from "../page/NoMatch";
export default class Loading extends React.Component{
  render(){
    const { error } = this.props;
    if(error){
        return <NoMatch/>;
    } else {
      return null;
    }

  }
}