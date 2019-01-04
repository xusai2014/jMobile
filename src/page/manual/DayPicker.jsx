import React from 'react';
import moment from "moment";
export default class DayPicker extends React.Component {
  constructor(props) {
    super(props);
    document.body.style.overflowY = 'hidden';
    document.body.style.position =  'fixed';
    this.state = {
      showPanel: false,
      selectIndex:4,
      dayVal:''
    };
    this.initDays()
  }

  destroyStyle(){
    document.body.style.overflowY = '';
    document.body.style.position =  'static';
  }

  componentWillUnmount(){
    this.destroyStyle();
  }

  selectDay() {
    this.setState({
      showPanel: true,
    })
  }

  moveList(len) {
    const {top: a, bottom: b} = this.refs.canlenda.getBoundingClientRect();
    const {top: x, bottom: y} = this.refs.mark.getBoundingClientRect();
    const dtaY = this.dtaObj.end_Y - this.dtaObj.Y;
    if ((a > x && dtaY > 0)
      || (y > b && dtaY < 0)) {
      return;
    }
    if(  dtaY >0 && this.dtaObj.dta_Y + dtaY >  4 * this.dtaObj.itemV  ){
      this.dtaObj.dta_Y = 3 * this.dtaObj.itemV
    } else if(dtaY <0 && Math.abs(this.dtaObj.dta_Y + dtaY) >  (len-4) * this.dtaObj.itemV){
      this.dtaObj.dta_Y = -(len-5) * this.dtaObj.itemV
    } else {
      this.dtaObj.dta_Y = this.dtaObj.dta_Y + dtaY;
    }
    this.refs.canlenda.style.transition = 'cubic-bezier(0,0,0.2,1.15) 0.5s';
    this.refs.canlenda.style.WebkitTransition = 'cubic-bezier(0,0,0.2,1.15) 0.5s';

    this.refs.canlenda.style.transform = `translate3d(0,${this.dtaObj.dta_Y}px,0)`;
    this.refs.canlenda.style.WebkitTransform = `translate3d(0,${this.dtaObj.dta_Y}px,0)`;
    this.reviseItem();
    this.selectValue();
  }

  reviseItem() {

    const l = this.dtaObj.dta_Y % (this.dtaObj.itemV);
    if (Math.abs(l) > 19) {
      //向上偏移
      this.dtaObj.dta_Y = this.dtaObj.dta_Y - this.dtaObj.itemV - l
      this.refs.canlenda.style.transform = `translate3d(0,${this.dtaObj.dta_Y}px,0)`;
      this.refs.canlenda.style.WebkitTransform = `translate3d(0,${this.dtaObj.dta_Y}px,0)`;

    } else {
      //向下偏移
      this.dtaObj.dta_Y = this.dtaObj.dta_Y - l
      this.refs.canlenda.style.transform = `translate3d(0,${this.dtaObj.dta_Y}px,0)`;
      this.refs.canlenda.style.WebkitTransform = `translate3d(0,${this.dtaObj.dta_Y}px,0)`;
    }
  }

  selectValue() {
    const addIndex = this.dtaObj.dta_Y/this.dtaObj.itemV;
    this.setState({
      selectIndex:4 - addIndex,
      dayVal:this.dtaObj.initArr[4 - addIndex]
    },()=>{
      this.props.onRes(4 - addIndex)
    })

  }

  dtaObj = {
    X: "",
    Y: "",
    end_X: "",
    end_Y: "",
    dta_Y: 0,
    limit_Y: 40,
    selcectIndex:4,
    initArr:[],
    itemV:0,
  }

  componentDidMount(){

  }


  initDays (){
    const days = moment().daysInMonth();
    const initArr =  new Array(days);
    for(let i = 1; i<=days; i++){
      initArr[i] = i;
    }
    this.dtaObj.initArr = initArr;
    const index = moment().get('date');
    const itemV = parseFloat(document.documentElement.style.fontSize)*0.7;
    this.dtaObj.dta_Y = -(index - this.dtaObj.selcectIndex)*itemV;
    this.dtaObj.selcectIndex = this.dtaObj.initArr[index];
    this.dtaObj.itemV = itemV;
  }



  render() {
    const {showPanel} = this.state;
    const { name = '', preventSlide, admitSlide} = this.props;

    return (
      [
        <div key={'1'} style={styles.input} onClick={() => {
          preventSlide();
          this.selectDay()
        }}>{
          this.state.dayVal?this.state.dayVal:'选择日期'
        }</div>,
        showPanel ?
          <div key={'2'} style={styles.panel} onClick={()=>{
            this.destroyStyle();
            admitSlide();
            this.setState({
              showPanel:false
            })
          }}  onTouchMove={(e)=>{
            e.preventDefault();
          }}
          >
            <div style={styles.container} onClick={(e)=>{
              e.preventDefault();
              e.stopPropagation();
            }}>
              <div style={styles.header}>
                <span style={{marginLeft: '0.3rem'}} onClick={()=>{
                  this.destroyStyle();
                  admitSlide();
                  this.setState({
                    showPanel:false
                  })
                }}>取消</span>
                <span>{name}</span>
                <span style={{color: '#4C7BFE', marginRight: '0.3rem'}} onClick={()=>{
                  this.selectValue();
                  this.destroyStyle();
                  admitSlide();
                  this.setState({
                    showPanel:false
                  });
                }}>确定</span>

              </div>
              <div style={styles.body}>
                <div style={{
                  ...styles.list,
                  transition: 'cubic-bezier(0,0,0.2,1.15) 0.5s',
                  WebkitTransition :'cubic-bezier(0,0,0.2,1.15) 0.5s',
                  transform : `translate3d(0,${this.dtaObj.dta_Y}px,0)`,
                  WebkitTransform : `translate3d(0,${this.dtaObj.dta_Y}px,0)`,
                }}
                     onTouchMove={(e) => {
                       this.dtaObj.end_X = e.touches[0].pageX
                       this.dtaObj.end_Y = e.touches[0].pageY

                     }}
                     onTouchEnd={(e) => {
                       this.moveList(this.dtaObj.initArr.length);
                     }}
                     onTouchStart={(e) => {
                       this.dtaObj.X = e.touches[0].pageX
                       this.dtaObj.Y = e.touches[0].pageY
                     }}
                     ref="canlenda"
                >
                  {
                    this.dtaObj.initArr.map((v, k) => {
                      return <div key={k} style={styles.item}>{k}</div>
                    })
                  }
                </div>
                <div ref="mark" style={styles.mark}></div>
              </div>
            </div>
          </div> : null
      ]
    )
  }
}
const styles = {
  panel: {
    background: 'rgba(0, 0, 0, 0.4)',
    position: 'absolute',
    top: '0',
    bottom: '0',
    width: '7.5rem'
  },
  container: {
    position: 'fixed',
    width: '7.5rem',
    bottom: '0',
    backgroundColor: '#FFFFFF',
    fontSize: '0.27rem'
  },
  input: {
    lineHeight: '1rem',
    fontSize: '0.31rem',
    color: '#999999',
    letterSpacing: '0',
    border: '0',
  },
  header: {
    width: '7.5rem',
    fontSize: '0.31rem',
    display: 'flex',
    letterSpacing: '-1px',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '0.99rem',
    border: '1PX solid #F1F1F1'
  },
  list: {
    width: '7.5rem',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    margin: "0 auto"

  },
  body: {
    overflow: 'hidden',
    width: '7.5rem',
    height: '4rem',
    position: 'relative'
  },
  item: {
    fontSize: '0.31rem',
    color: '#999999',
    letterSpacing: '-1PX',
    height: '0.7rem'
  },
  mark: {
    background: '#F0F7FF',
    width: '7.5rem',
    height: '0.7rem',
    position: 'absolute',
    zIndex: '-1',
    top: '2rem'
  },
  paceHolder: {
    fontSize: '0.31rem',
    color: '#999999',
    letterSpacing: '0',
    height: '0.44rem',
    width: '3.6rem',
    border: '0',
  },
}
