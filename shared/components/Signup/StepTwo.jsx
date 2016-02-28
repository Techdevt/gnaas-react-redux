import React, { Component, PropTypes } from 'react';
import { Textfield, Button } from 'react-mdl';

class StepTwo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			password: props.fieldValues.password,
			passMatchError: ''
		};
	}

	matchPassword = (event) => {
		((event.target.value.length > 0) && (event.target.value !== this.state.password) ) ? this.setState({passMatchError: 'Passwords do not match'}) : this.setState({passMatchError: ''});
	};

	onFieldChanged = (evt) => {
		this.setState({[evt.target.name]: evt.target.value});
	};

	render() {
		return (
			<form className="Signup__container--step" onSubmit={this.props.onCallbackParent.bind(this, this.state, this.props.next)}>
				<div className="Signup__container--body-fieldrow">
					<Textfield
					    label="Email"
					    floatingLabel
					    name="email"
					    type="email"
					    required={true}
					    onChange={this.onFieldChanged}
					    defaultValue={this.props.fieldValues.email}
					/>
				</div>

				<div className="Signup__container--body-fieldrow">
					<Textfield
					    label="Username"
					    floatingLabel
					    name="username"
					    required={true}
					    onChange={this.onFieldChanged}
					    defaultValue={this.props.fieldValues.username}
					/>
				</div>

				<div className="Signup__container--body-fieldrow doubly">
					
						<Textfield
						    label="Password"
						    floatingLabel
						    name="password"
						    ref="password"
						    type="password"
						    required={true}
						    onChange={this.onFieldChanged}
						    defaultValue={this.props.fieldValues.password} 
						/>
					
					
						<Textfield
						    label="Confirm Password"
						    floatingLabel
						    name="confirmPassword"
						    ref="confirm-password"
						    type="password"
						    onChange={this.matchPassword}
						    error={this.state.passMatchError}
						/>
					
				</div>

				<div className="Signup__container--body-fieldrow actions">
					{
						(this.props.index !== 0) &&
						<Button raised onClick={this.props.previous}>Prev</Button>
					}
					<Button raised primary type="submit">Next</Button>
				</div>
			</form>
		);
	}
}

export default React.createFactory(StepTwo);