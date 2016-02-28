import React, { PropTypes, Component } from 'react';
import { Button } from 'react-mdl';

export default class UnauthorizedComponent extends Component {
	constructor(props) {
		super(props);
	}

	goBack = () => {
		const { history } = this.props;
		history.goBack();
	};

	render() {
		return (
			<div>
				<span>user not authorized to visit route</span>
				{'  '}
				<Button raised primary onClick={this.goBack}>Go Back</Button>
			</div>
		);
	}
}