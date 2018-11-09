import React from 'react';
import {withRouter} from 'react-router-dom'
import {getSearch} from "../utils/util";

class FixedContent extends React.Component {

    initStyle() {
        const designedWidth = 750;
        const actualWidth = Math.min(450, $(window).width());
        window.requestAnimationFrame(()=> {
            document.body.style.overflowY = '';
            document.body.style.position =  'static';
            document.documentElement.style.fontSize = actualWidth * 100 / designedWidth + 'px';
        })
    }

    componentWillMount() {
        this.initStyle()
    }

    render() {
        var {className, children,} = this.props;
        return (
            <div ref="content" className={className} style={{background: '#F5F5F5', width:'7.5rem',minHeight:gloablMinHeight}}>
                {children}
            </div>
        );
    }
}

export default FixedContent = withRouter(FixedContent)
