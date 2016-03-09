import React, { Component, PropTypes } from 'react';
import {Button, Textfield} from 'react-mdl';

class StepOneAlumni extends Component {
	constructor(props) {
		super(props);
	}

	onChange = (evt) => {
		this.setState({[evt.target.name]: evt.target.value});
	};

	render() {
		return (
			<form className="Signup__container--step" onSubmit={this.props.onCallbackParent.bind(this, this.state, this.props.next)}>
				<div className="Signup__container--body-fieldrow doubly">
					<Textfield
					    label="Affiliated Institution"
					    floatingLabel
					    onChange={this.onChange}
					    required={true}
					    name="affiliatedInstitution"
					/>

					<Textfield
					    label="Resident Country"
					    floatingLabel
					    onChange={this.onChange}
					    required={true}
					    name="residingCountry"
					/>
				</div>

				<div className="Signup__container--body-fieldrow doubly">
					
						<Textfield
						    label="Title"
						    floatingLabel
						    onChange={this.onChange}
						    name="title"
						    defaultValue={this.props.fieldValues.title}
						/>
					
						<Textfield
					    label="First Name"
					    floatingLabel
					    onChange={this.onChange}
					    name="firstName"
					    required={true}
					    defaultValue={this.props.fieldValues.firstName}
						/>
					
				</div>

				<div className="Signup__container--body-fieldrow">
					<Textfield
					    label="Last Name"
					    floatingLabel
					    onChange={this.onChange}
					    name="lastName"
					    required={true}
					    defaultValue={this.props.fieldValues.lastName}
					/>
				</div>

				<div className="Signup__container--body-fieldrow actions">
					{
						(this.props.index !== 0) &&
						<Button raised className="" onClick={this.props.previous}>Prev</Button>
					}
					<Button raised primary type="submit" style={{marginLeft: '25%'}}>Next</Button>
				</div>
			</form>
		);
	}
}

export default React.createFactory(StepOneAlumni);