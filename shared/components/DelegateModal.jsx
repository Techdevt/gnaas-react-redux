import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Header, Icon, Content, Button } from 'react-mdl';
import Defer from 'promise-defer';
import Multistep from 'components/Signup/Multistep';
import steps from 'components/Signup/Delegate';

export default class DelegateModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalOpen: true,
			email: '',
			firstName: '',
			lastName: '',
			title: '',
			roles: {},
			location: '',
			state: '',
			postcode: '',
			address: ''
		};
		this.$promise = Defer();
	}

	static defaultProps =  {
		confirmLabel: 'OK',
		abortLabel: 'Cancel'
	};

	abort = () => {
		this.setState({
			isModalOpen: false
		});
		this.$promise.reject(false);
	};

	saveData = (fields, callback, evt) => {
		evt.preventDefault();
		if (fields !== null && typeof fields !== 'undefined') {
			this.setState(fields, function() {
				callback();
			});
		}else {
			callback();
		}
	};

	onSignup = (finishForm) => {
		finishForm();
		delete this.state.isModalOpen;
		this.$promise.resolve(this.state);
	};

	render() {
		const { isWaiting } = this.props;
		return (
			<Modal isOpen={this.state.isModalOpen} className="Signup">
				<Header style={{height: '40px'}}>
					<h4 className="confirmTitle">{this.props.title}</h4>
					<Icon name="cancel" onClick={this.abort}/>
				</Header>
				<Content className="Signup__container--body">
					<Multistep steps={steps} onCallbackParent={this.saveData} fieldValues={this.state} onSignup={this.onSignup} isWaiting={isWaiting}/>
				</Content>
			</Modal>
		);
	}
}