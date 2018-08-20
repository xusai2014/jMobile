import React from 'react'
export default class LoadCom extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isMore:false,
      isLoading:false,
    }
  }

  componentDidMount(){
     const loadNode = document.getElementById('load')
    loadNode.addEventListener('scroll', this.scrollLoad, false);

  }


  scrollLoad =()=> {
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
    const { status = '',currentNum, pageSize,totalPages } = this.props;
    const { isLoading,isMore} = this.state;

    return(<div id="wrapper" style={{
      textAlign: 'center',
      marginBottom: '0.5rem',
    }}>{
      isLoading?'正在加载中...':(
        parseInt(totalPages)>parseInt(currentNum)?'下拉加载':"没有更多了"
      )
    }
    </div>)
  }
}