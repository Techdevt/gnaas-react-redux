import React, { PropTypes, Component } from 'react';
import {Cell, IconButton, Button } from 'react-mdl';
import { editUser, deleteImage } from 'actions/AuthActions';
import AutosizeInput from 'react-input-autosize';
import { connect } from 'react-redux';

@connect(state => ({
	isWaiting: state.Auth.get('isWaiting'), 
	actionWaiting: state.users.get('actionWaiting'),
	actionResult: state.users.get('actionResult'),
	message: state.Auth.get('message'),
	actionSuccess: state.users.get('actionSuccess'),
	authSuccess: state.Auth.get('authSuccess')
}))
export default class ContactDetails extends Component {
	constructor(props) {
		super(props);
		const { user, type } = this.props;
		this.state = {
			homePhone: user.roles[type].homePhone,
			phone: user.roles[type].phone,
			location: user.location,
			state: user.state,
			postCode: user.postCode,
			address: user.address
		};

		this.currValues = Object.assign({}, this.state, { id: null });
	}

	componentDidUpdate(prevProps, prevState) {
		Object.keys(this.state).map((key) => {
			if(this.currValues.hasOwnProperty(key)) {
				if(this.state[key] !== this.currValues[key]) {
					this.props.setDirty();
				}
			}
		});
	}

	componentWillUnmount() {
		this.props.unsetDirty();
	}

	onInputClick = (evt) => {
		evt.target.readOnly = false;
		evt.target.onblur = this.onLoseFocus.bind(this);
		evt.target.focus();
	};

	onLoseFocus = (evt) => {
		evt.target.readOnly = true;
	};

	onFieldChange = (evt) => {
		if(evt.target.id) {
			const index = eval(evt.target.id);
			return this.setState({
				[evt.target.name]: [
							...this.state[evt.target.name].slice(0, index), 
							evt.target.value,
							...this.state[evt.target.name].slice(index + 1)
							]
			});
		}
		this.setState({
			[evt.target.name]: evt.target.value
		});
	};

	handleSubmit = () => {
		if(!this.props.$dirty) return;

		const { state, currValues } = this;
		const { dispatch } = this.props;
		
		let formData = new FormData();
		Object.keys(state).forEach(function(key) {
			if((state[key] !== undefined) && (currValues[key] !== state[key])) {
				formData.append(key,  JSON.stringify(state[key]));
			} else if(!currValues.hasOwnProperty(key)) {
				formData.append(key,  JSON.stringify(state[key]));	
			}
		});

		dispatch(editUser(formData));
		this.props.unsetDirty();
	};

	handleAddressAdd = (evt) => {
		this.setState({
			address: [...this.state.address, '...']
		});
			const addresses = this.refs['addresses'];
			this.forceUpdate(function() {
				const list = addresses.children[(addresses.children.length - 1)];
				const input = list.children[0].children[0];
				input.readOnly = false;
				input.focus();
				input.setSelectionRange(input.value.length, input.value.length);
			});
	};

	handleAddressEdit = (index, evt) => {
		const addresses = this.refs['addresses'];
		const list = addresses.children[index];
		const input = list.children[0].children[0];
		input.readOnly = false;
		input.focus();
		input.setSelectionRange(input.value.length, input.value.length);
	};
	
	handleAddressDelete = (index, evt) => {
		this.setState({
			address: [
						...this.state.address.slice(0, index),
						...this.state.address.slice(index + 1)
					] 
		});
	};

	render() {
		const { type, user } = this.props;
		const passedAvatar = user.roles[type].avatarUrl[1] || user.roles[type].avatarUrl[0];
		
		return (
			<div>
			{
				<div className="DashContent__inner">
		    		<Cell className="Settings__main" col={8} phone={4} tablet={8}>
		    			<h2 className="dash_title">Contact Information</h2>
		    			<div className="Settings__main--big">
		    				<div>
		    					<div className="inner-div">
		    						<h2 className="dash_title">Postcode</h2>
		    						<AutosizeInput type="text" name="postCode" value={this.state.postCode} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
		    					</div>
		    					<div className="inner-div">
		    						<h2 className="dash_title">State</h2>
		    						<AutosizeInput type="text" name="state" value={this.state.state} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
		    					</div>
		    				</div>
		    				<div>
		    					<div className="inner-div">
		    						<h2 className="dash_title">Location</h2>
		    						<AutosizeInput type="text" name="location" value={this.state.location} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
		    					</div>
		    				</div>
		    				
			    				{
			    					(type === 'shopper') &&
			    					<div>
				    					<div className="inner-div">
				    						<h2 className="dash_title">Mobile No</h2>
				    						<AutosizeInput type="text" name="homePhone" value={this.state.homePhone} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
				    					</div>
				    					<div className="inner-div">
				    						<h2 className="dash_title">Telephone No</h2>
				    						<AutosizeInput type="text" name="phone" value={this.state.phone} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
				    					</div>
			    					</div>
			    				}

			    				{
			    					(type === 'merchant') &&
			    					<div>
				    					<div className="inner-div">
				    						<h2 className="dash_title">Telephone No</h2>
				    						<AutosizeInput type="text" name="phone" value={this.state.phone} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
				    					</div>
			    					</div>
			    				}
		    					
		    				<div>
		    					<div className="inner-div Addresses">
		    						<h2 className="dash_title">Addresses <IconButton raised ripple className="Addresses_Add" name="add" onClick={this.handleAddressAdd}/></h2>
		    						<ul className="Address_List" ref="addresses">
			    						{
			    							this.state.address.map((item, index) => {
			    								return (
			    									<li key={index}>
			    										<AutosizeInput type="text" 
			    										name="address"
			    										value={this.state.address[index]} 
			    										onChange={this.onFieldChange} 
			    										id={index}
			    										readOnly={true}
			    										onClick={this.onInputClick}/>
			    										<div className="actions" style={{
			    											display: (item !== '') ? 'inline-block' : 'none'
			    										}}>
				    										<IconButton name="edit" raised ripple onClick={this.handleAddressEdit.bind(this, index)}/>
				    										<IconButton name="cancel" raised ripple onClick={this.handleAddressDelete.bind(this, index)}/>
			    										</div>
			    									</li>
			    								);
			    							})
			    						}
		    						</ul>
		    					</div>
		    				</div>
		    			</div>
		    			<Button raised accent className="Settings__action-btn" onClick={this.handleSubmit}>Update Contact</Button>
		    		</Cell>
		    	</div>
			}
		</div>	
		);
	}
}