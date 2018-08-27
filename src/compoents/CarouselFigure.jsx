import  React from 'react';
import styles from  './CarouselFigure.scss';
import { Carousel }  from 'antd-mobile';
import {withRouter} from 'react-router-dom';
@withRouter
export  default class CarouselFigure extends React.Component {

  componentWillMount() {
    this.state = {
      bannerData: []
    };
    let {prodType} = this.props;
  }

  render() {
    const {width, height,dots = true} = this.props;
    const {bannerData=[] } = this.state;
    return (
      <div style={{position: 'relative', width: width, height: height}} className={bannerData.length >1 ? styles.carousel :styles.carousel1}>
          <Carousel
            className='my-carousel'
            autoplay={bannerData.length >1 ?true:false}
            infinite
            selectedIndex={bannerData.length>1? 1:0}
            dots={dots}
            dotStyle={{width: '0.12rem', height: '0.12rem', background: "rgba(255, 255, 255, 0.5)"}}
            dotActiveStyle={{width: '0.12rem', height: '0.12rem', background: "#fff"}}
          >
            {bannerData.map((res, k) => {
              const {  adNm= '', adNo=''} = res;
              return (<a key={k} href={res.linkUrl} >
                  <img
                    style={{width: width, height: height}}
                    src={res.imgUrl}
                    alt="icon"
                  />
                </a>
              )
            })}
          </Carousel>
      </div>
    )
  }
}
