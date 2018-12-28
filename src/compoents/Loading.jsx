import React from 'react';
import NoMatch from "../page/NoMatch";
export default class Loading extends React.Component{
  render(){
    const { error } = this.props;
    if(error){
        return <NoMatch/>
    } else {
      return [<style key="style">{
        `.spinner {
        margin: 80px auto;
        width: 20px;
        height: 20px;
        position: relative
      }

        .container1 > div, .container2 > div, .container3 > div {
        width: 6px;
        height: 6px;
        background-color: #929292;
        border-radius: 100%;
        position: absolute;
        -webkit-animation: bouncedelay 1.2s infinite ease-in-out;
        animation: bouncedelay 1.2s infinite ease-in-out;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both
      }

        .spinner .spinner-container {
        position: absolute;
        width: 100%;
        height: 100%
      }

        .container2 {
        -webkit-transform: rotateZ(45deg);
        transform: rotateZ(45deg)
      }

        .container3 {
        -webkit-transform: rotateZ(90deg);
        transform: rotateZ(90deg)
      }

        .circle1 {
        top: 0;
        left: 0
      }

        .circle2 {
        top: 0;
        right: 0
      }

        .circle3 {
        right: 0;
        bottom: 0
      }

        .circle4 {
        left: 0;
        bottom: 0
      }

        .container2 .circle1 {
        -webkit-animation-delay: -1.1s;
        animation-delay: -1.1s
      }

        .container3 .circle1 {
        -webkit-animation-delay: -1s;
        animation-delay: -1s
      }

        .container1 .circle2 {
        -webkit-animation-delay: -.9s;
        animation-delay: -.9s
      }

        .container2 .circle2 {
        -webkit-animation-delay: -.8s;
        animation-delay: -.8s
      }

        .container3 .circle2 {
        -webkit-animation-delay: -.7s;
        animation-delay: -.7s
      }

        .container1 .circle3 {
        -webkit-animation-delay: -.6s;
        animation-delay: -.6s
      }

        .container2 .circle3 {
        -webkit-animation-delay: -.5s;
        animation-delay: -.5s
      }

        .container3 .circle3 {
        -webkit-animation-delay: -.4s;
        animation-delay: -.4s
      }

        .container1 .circle4 {
        -webkit-animation-delay: -.3s;
        animation-delay: -.3s
      }

        .container2 .circle4 {
        -webkit-animation-delay: -.2s;
        animation-delay: -.2s
      }

        .container3 .circle4 {
        -webkit-animation-delay: -.1s;
        animation-delay: -.1s
      }

        @-webkit-keyframes bouncedelay {
        0%, 100%, 80% {
        -webkit-transform: scale(0)
      }
        40% {
        -webkit-transform: scale(1)
      }
      }

        @keyframes bouncedelay {
        0%, 100%, 80% {
        transform: scale(0);
        -webkit-transform: scale(0)
      }
        40% {
        transform: scale(1);
        -webkit-transform: scale(1)
        }
      }`
      }
      </style>,<div key='div' className="spinner">
        <div className="spinner-container container1">
          <div className="circle1"></div>
          <div className="circle2"></div>
          <div className="circle3"></div>
          <div className="circle4"></div>
        </div>
        <div className="spinner-container container2">
          <div className="circle1"></div>
          <div className="circle2"></div>
          <div className="circle3"></div>
          <div className="circle4"></div>
        </div>
        <div className="spinner-container container3">
          <div className="circle1"></div>
          <div className="circle2"></div>
          <div className="circle3"></div>
          <div className="circle4"></div>
        </div>
      </div>]
    }

  }
}