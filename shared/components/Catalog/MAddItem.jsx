import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-mdl';
import Defer from 'promise-defer';

export default class MAddItem extends Component {
	constructor(props) {
		super(props);
	}

	add = () => {
		this.props.closePortal();
	};

	render() {
		return(
			<div className="AddItemContainer" ref="container">
				{this.props.children}
				<div className="actions">
					<Button onClick={this.props.closePortal}>Cancel</Button>
					<Button onClick={this.add}>Ok</Button>
				</div>
			</div>
		);
	}
}