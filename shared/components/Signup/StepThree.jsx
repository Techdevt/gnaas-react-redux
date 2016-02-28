import React, { Component, PropTypes } from 'react';
import {Textfield, Button, Spinner} from 'react-mdl';

class StepThree extends Component {
	onFieldChanged = (evt) => {
		this.setState({[evt.target.name]: evt.target.value});
	};

	render() {
		return (
			<form className="Signup__container--step" onSubmit={this.props.onCallbackParent.bind(this, this.state, this.props.onSignup.bind(this, this.props.next))}>
				<div className="Signup__container--body-fieldrow doubly">
					
						<Textfield
						    label="Location"
						    floatingLabel
						    name="location"
						    onChange={this.onFieldChanged}
						    defaultValue={this.props.fieldValues.location}
						/>
					
					
						<Textfield
						    label="State"
						    floatingLabel
						    name="state"
						    onChange={this.onFieldChanged}
						    defaultValue={this.props.fieldValues.state}
						/>
					
				</div>
				<div className="Signup__container--body-fieldrow">
					
						<Textfield
						    label="Postal Code"
						    floatingLabel
						    name="postcode"
						    onChange={this.onFieldChanged}
						    defaultValue={this.props.fieldValues.postcode}
						/>
				</div>
					
				<div className="Signup__container--body-fieldrow">
						<Textfield
						    label="Address"
						    floatingLabel
						    name="address"
						    onChange={this.onFieldChanged}
						    defaultValue={this.props.fieldValues.address}
						/>
				</div>
				<div className="Signup__container--body-fieldrow actions">
					{
						(this.props.index !== 0) &&
						<Button raised onClick={this.props.previous}>Prev</Button>
					}
					<Button raised primary type="submit" className="Signup__container--body-fieldrow_submit">Submit</Button>
					<Spinner style={{
						display: this.props.isWaiting ? 'block' : 'none'
					}}/>
				</div>
			</form>
		);
	}
}

export default React.createFactory(StepThree); 