import React from 'react';

export default class CustomIcon extends React.Component {

  render() {
    const { type, size, className,} =this.props;

     const CustomIcon = ({ type, className = '', size = 'md', ...restProps }) => (
           <svg
       className={`am-icon am-icon-${type.substr(1)} am-icon-${size} ${className}`}
         {...restProps}
       >
         <use xlinkHref={type} /> {/* svg-sprite-loader@0.3.x */}
         {/* <use xlinkHref={#${type.default.id}} /> */} {/* svg-sprite-loader@latest */}
       </svg>
     );
    return <CustomIcon size={size} className={className} type={require(`./img/${type}.svg`)} />
  }
}