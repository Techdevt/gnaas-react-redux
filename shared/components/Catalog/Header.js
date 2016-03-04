import React, { PropTypes, Component } from 'react';
import { Header } from 'react-mdl';

export default class CHeader extends Component {
	componentWillEnter() {
		console.log('header will enter');
	}

	componentWillMount() {
		console.log('header will mount');
	}

	render() {
		return (
			<Header>
				<span>Add Item</span>
			</Header>
		);
	}
}