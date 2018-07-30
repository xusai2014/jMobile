import React from 'react';
import {withRouter} from 'react-router-dom'
import {getSearch} from "../utils/util";
import {Toast} from 'antd-mobile'
import 'antd-mobile/lib/toast/style/index.css'

class FixedContent extends React.Component {

    setFontSize() {
        var designedWidth = 750;
        let actualWidth = Math.min(450, $(window).width());
        document.documentElement.style.fontSize = actualWidth * 100 / designedWidth + 'px';
    }

    componentWillMount() {

        if (!sessionStorage.getItem("mobileNo")) {
            let search = getSearch(this.props)
            !!search ?
                this.props.history.push(`/cca/creditApply/${search.recommendPhoneEnc}/${search.channelId}/${encodeURIComponent(search.url)}`)
                : undefined
        }
        this.setFontSize();
    }

    componentDidMount() {

        window.addEventListener("resize", this.setFontSize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setFontSize);
    }

    adjustWidth() {
        $(this.refs.content).css(this.getContentStyle());
    }

    render() {
        var {className, children, style} = this.props;
        return (
            <div ref="content" className={className} style={{background: '#FFFFFF', width:'7.5rem',minHeight:gloablMinHeight}}>
                {children}
            </div>
        );
    }
}

export default FixedContent = withRouter(FixedContent)
