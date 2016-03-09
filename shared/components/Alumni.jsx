import React, { Component, PropTypes } from 'react';
import { Cell } from 'react-mdl';
import steps from 'components/Signup/Alumni';
import Multistep from 'components/Signup/Multistep';
import { createUser } from 'actions/AuthActions';
import { connect } from 'react-redux';
import Notification from 'react-notification';

@connect(state => ({ Auth: state.Auth }))
export default class Sell extends Component {
	constructor(props) { 
		super(props);
		this.state = {
			companyName: '',
			email: '',
			username: '',
			password: '',
			location: '',
			affiliatedInstitution: '',
			residingCountry: '',
			address: ''
		};
		this.isMessageActive = false;
	} 

	componentWillMount() {
		const { history, Auth } = this.props;

		if(Auth.get('isAuthenticated')) {
			history.replace('/dashboard');
		}
	}

	componentWillUpdate(nextProps, nextState) {
		const { Auth, history } = nextProps;

		//shouldRedirect
		if(Auth.get('shouldRedirect')) {
			//message
			if(Auth.get('message')) {
				let submit = document.querySelector('.Signup__container--body-fieldrow_submit');

				if(Auth.get('shouldRedirect')) {
					submit.classList.add('success');
				}

				this.isMessageActive = true;
			}
		}
	}

	redirect = () => {
		this.isMessageActive = false;
		const { Auth, history } = this.props;
		let submit = document.querySelector('.Signup__container--body-fieldrow_submit');

		if(Auth.get('shouldRedirect')) {
			submit.classList.remove('success');
			setTimeout(function() {
				history.replace(`/${Auth.get('redirectLocation')}`);
			}, 2000);
		}
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
		//clear passMatchError propagated from password checking
		delete this.state.passMatchError;

		const { dispatch } = this.props; 
		dispatch(createUser({...this.state, action: {
            type: 'CREATE_ALUMNI'
        }}));
	}; 

	render() {
		const {Auth} = this.props;
		return (
			<div className="Signup">
				<Cell col={6} tablet={6} phone={4} className="Signup__container mdl-shadow--6dp">
					<div className="Signup__container--header">
						<h4>Register as Alumni</h4>
					</div>
					<div className="Signup__container--body">
						<Multistep steps={steps} onCallbackParent={this.saveData} fieldValues={this.state} onSignup={this.onSignup} isWaiting={Auth.get('isWaiting')}/>
					</div>
				</Cell>
				<Notification
				  isActive={this.isMessageActive}
				  message={Auth.get('message')}
				  action="close"
				  onClick={this.redirect}
				  dismissAfter={5000}
				  onDismiss={this.redirect}
				/>
			</div>
		);
	}
}