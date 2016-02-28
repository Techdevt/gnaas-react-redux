import React from 'react';
import cx from 'classnames';

export default class Icon extends React.Component {
    render() {
    	return (
	        <i
	            {...this.props}
	            className={cx(`Icon mdi mdi-${this.props.type}`, this.props.className)}
	        />
	    );
    }
}
 