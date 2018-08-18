import React from 'react'
export default class LoadCom extends React.Component{

  componentDidMount(){
    window.addEventListener('scroll', this.scrollLoad, false);

  }


  scrollLoad =()=> {
    const that = this;
    const { loadMoreDataFn } = this.props;
    if (!this.state.isMore) {
      return;
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.timer = setTimeout(() => {
      const wrapper = document.getElementById('wrapper');
      if(!wrapper){
        return;
      }
      const top = wrapper.getBoundingClientRect().top;
      const windowHeight = window.screen.height;

      if (top && top < windowHeight) {
        // 当 wrapper 已经被滚动到页面可视范围之内触发
        loadMoreDataFn();
      }
    }, 5);
  }

  componentWillUnmount(){
    window.removeEventListener('scroll', this.scrollLoad,false);

  }
  render(){
    const { status = '' } = this.props;

    return(<div id="wrapper">{status}</div>)
  }
}