import React, { Component, PropTypes } from 'react';
import { Textfield, Button, Checkbox } from 'react-mdl';

class StepTwo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			roles: this.props.fieldValues.roles
		};
	} 

	matchPassword = (event) => {
		((event.target.value.length > 0) && (event.target.value !== this.state.password) ) ? this.setState({passMatchError: 'Passwords do not match'}) : this.setState({passMatchError: ''});
	};

	onFieldChanged = (evt) => {
		this.setState({[evt.target.name]: evt.target.value});
	};

	checkChanged = (evt) => {
		const roles = this.state.roles;
		roles[evt.target.name] = evt.target.checked;
		
		this.setState({
			roles: roles
		});
	};

	render() {
		return (
			<form className="Signup__container--step" onSubmit={this.props.onCallbackParent.bind(this, this.state, this.props.next)}>
				<div className="Signup__container--body-fieldrow doubly">
					
						<Textfield
						    label="Title"
						    floatingLabel
						    onChange={this.onFieldChanged}
						    name="title"
						    defaultValue={this.props.fieldValues.title}
						/>
					
					
						<Textfield
						    label="Last Name"
						    floatingLabel
						    onChange={this.onFieldChanged}
						    name="lastName"
						    required={true}
						    defaultValue={this.props.fieldValues.lastName}
						/>
					
				</div>
				<div className="Signup__container--body-fieldrow doubly">
					<Textfield
					    label="First Name"
					    floatingLabel
					    onChange={this.onFieldChanged}
					    name="firstName"
					    required={true}
					    defaultValue={this.props.fieldValues.lastName}
					/>

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

				<div className="Signup__container--body-fieldrow doubly roles">
					<Checkbox label="Customer Service" ripple value={false} checked={this.state.roles['Customer Service']} name="Customer Service" onChange={this.checkChanged}/>
					<Checkbox label="Inventory Management" name="Inventory Management" value={false} ripple checked={this.state.roles['Inventory Management']} onChange={this.checkChanged}/>
                </div>

				<div className="Signup__container--body-fieldrow actions">
					{
						(this.props.index !== 0) &&
						<Button raised onClick={this.props.previous}>Prev</Button>
					}
					<Button raised primary type="submit" ref="next" style={{
						margin: '20px auto'
					}}>Next</Button>
				</div>
			</form>
		);
	}
}

export default React.createFactory(StepTwo);