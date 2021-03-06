import React from 'react'
export default class LoadCom extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isMore:false,
      isLoading:false,
    }
  }
  timer = null
  componentDidMount(){
    window.addEventListener('scroll', this.scrollLoad, false);
  }


  scrollLoad =(e)=> {
    e.preventDefault();
    const { loadMoreDataFn,currentNum, pageSize,totalPages } = this.props;
    if (parseInt(totalPages)<=parseInt(currentNum) || this.state.isLoading) {
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
        this.setState({
          isLoading:true
        },()=>{
          loadMoreDataFn(currentNum+1,pageSize,()=>this.setState({isLoading:false}))
        });
      }
    }, 5);
  }

  componentWillUnmount(){
    window.removeEventListener('scroll', this.scrollLoad,false);

  }
  render(){
    const { currentNum, totalPages } = this.props;
    const { isLoading, } = this.state;

    return(<div id="wrapper" style={{
      textAlign: 'center',
    }}>{
      isLoading?'正在加载中...':(
        parseInt(totalPages)>parseInt(currentNum)?'下拉加载':"没有更多了"
      )
    }
    </div>)
  }
}