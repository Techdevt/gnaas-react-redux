import React, { PropTypes, Component } from 'react';
import Modal from 'react-modal';
import { Icon, Content, Button } from 'react-mdl';

export default class ActionResult extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isModalOpen: this.props.isOpen
		};
	}

	componentDidMount() {
		const { type } = this.props;
		if(type === 'success') {
			const successIcon = document.querySelector('.success-icon');
			successIcon.classList.add('is-animating');
			setTimeout(() => {
				successIcon.classList.remove('is-animating');
			}, 1000);
		}
	}

	ok = () => {
		this.setState({
			isModalOpen: false
		});
		this.props.onConfirm();
	};

	render() {
		const { type, message, isOpen } = this.props;
		
		return (
			<Modal isOpen={this.state.isModalOpen}>
				<Content>
					{
						message && 
						<p>{message}</p>
					}
					<Icon name={(type === 'success') ? 'thumb_up': 'error'} className={(type === 'success') ? 'success-icon': 'failure-icon'} primary/>
					<div className="Button-container">
		  				<Button onClick={this.ok} raised>Ok</Button>
					</div>
				</Content>
			</Modal>
		);
	}
}