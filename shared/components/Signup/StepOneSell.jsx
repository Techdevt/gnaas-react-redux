import React, { Component, PropTypes } from 'react';
import {Button, Textfield} from 'react-mdl';

class StepOneSell extends Component {
	constructor(props) {
		super(props);
	}

	onChange = (evt) => {
		this.setState({[evt.target.name]: evt.target.value});
	};

	render() {
		return (
			<form className="Signup__container--step" onSubmit={this.props.onCallbackParent.bind(this, this.state, this.props.next)}>
				<div className="Signup__container--body-fieldrow">
					<Textfield
					    label="Company Name"
					    floatingLabel
					    onChange={this.onChange}
					    required={true}
					    name="companyName"
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

export default React.createFactory(StepOneSell);