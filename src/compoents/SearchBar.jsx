import React from 'react';
import styles from './SearchBar.scss';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {createForm} from 'rc-form'

// @Form.create()
class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isActive: false, /**/
        }
    }


    componentWillMount() {

    }

    onSubmit = () => {
        const {
            onSubmit = () => {
            }
        } = this.props;
        let value = this.props.form.getFieldValue("searchDate")
        this.setState({isActive: false})
        onSubmit(value)
    }

    onClick = () => {
        this.setState({isActive: !this.state.isActive})
    }

    render() {
        const {placeholder = ""} = this.props
        const {getFieldProps} = this.props.form
        return (
            <div className={styles.contentStyle}>
                <form action="javascript:;" onSubmit={() =>{
                    this.onSubmit();
                    const searchId = document.getElementById('searchId');
                    searchId.blur();
                }}>
                    <img src="/static/img/search.png" className={styles.searchStyle}></img>
                    <input id="searchId" className={styles.inputStyle} type="text" placeholder="搜你想要的银行卡"
                           {...getFieldProps("searchDate")} onClick={() => {
                        {
                            this.setState({isActive: true})
                        }
                    }}
                    />
                </form>
                {
                    this.state.isActive ? <div onClick={() => {
                            this.onClick()
                        }} style={{
                            position: 'fixed',
                            top: '0.8rem',
                            left: '0%',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'black',
                            zIndex: '1001',
                            opacity: '0.5'
                        }}></div>
                        : undefined
                }
            </div>
        )
    }
}


const mapPropsToState = (state) => {
    return {}
};

export default withRouter(connect(mapPropsToState)(createForm()(SearchBar)))
