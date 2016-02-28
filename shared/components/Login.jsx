import React, { Component, PropTypes } from 'react';
import { Cell, Header, Textfield, Checkbox, Button, FABButton, Icon } from 'react-mdl';
import Router, { Link } from 'react-router';
import { connect } from 'react-redux';
import { authenticateUser, cleanAuthMessage } from 'actions/AuthActions';
import ActionResult from 'components/ActionResult';


@connect(state => ({Auth: state.Auth})) 
export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: ''
		};
	}

	onSignupClick = (e) => {
		e.preventDefault();
		const { history } = this.props;
		history.push(`/signup`);
	};

	onFieldChanged = (evt) => {
		this.setState({[evt.target.name]: evt.target.value});
	};

	componentWillMount() {
		const { history, Auth } = this.props;

		if(Auth.get('isAuthenticated')) {
			//if we coming from dashboard, we want to skip history twice
			history.replace('/dashboard');
		}
	}

	componentWillUpdate = (nextProps, nextState) => {
		const { Auth, history, location } = nextProps; 
		let returnTo = (location.query.hasOwnProperty('returnTo')) ? location.query.returnTo : '/dashboard';

		if(Auth.get('isAuthenticated')) {
			let storage = window.localStorage;
			storage.setItem('token', JSON.stringify(Auth.get('token')));
			history.replace(returnTo);
		}
	};

	onSubmit = (evt) => {
		evt.preventDefault();

		const { dispatch } = this.props;

		dispatch(authenticateUser(this.state));
	};

	clearMessage = () => {
		const { dispatch } = this.props;
		dispatch(cleanAuthMessage());
	};
	

	render() {
		const { Auth } = this.props;
		const authSuccess = Auth.get('authSuccess');
		const message = Auth.get('message');

		return (
			<div className="Login">
				{
					(message) &&
					<ActionResult type={(authSuccess) ? 'success': 'failure'} onConfirm={
						() => {
							(message !== '') ? this.clearMessage(): false;
						}
					} message={message} isOpen={true}/>
				}
				<Cell col={4} tablet={6} phone={8} className="Login__container mdl-shadow--6dp">
					<div className="Login__container--header">
						<h4>Login</h4>
					</div>
					<form className="Login__container--body" onSubmit={this.onSubmit}>
						<div className="Login__container--body-inputfield">
							<Textfield
							    label="Username/Email"
							    floatingLabel
							    onChange={this.onFieldChanged}
							    required={true}
							    name="email"
							/>
						</div>
						<div className="Login__container--body-inputfield">
							<Textfield
							    label="Password"
							    floatingLabel
							    type="password"
							    name="password"
							    onChange={this.onFieldChanged}
							    required={true}
							/>
						</div>
						<div className="Login__container--body-lockin">
							<Checkbox label="Keep me signed in" ripple accent />
						</div>
						<div className="Login__container--body-submit"> 
							<Button raised primary ripple>Sign In</Button>
						</div>
						<div className="Login__container--body-forgot">
							<Link to="/forgot" className="Login__container--body-forgot__link">Forgot Password</Link>
						</div>
						<FABButton ripple raised accent className="Login__container--body-signup-fav" onClick={this.onSignupClick}>
                            <Icon name="add" />
                        </FABButton>
					</form>
				</Cell>
			</div>
		);
	}
}