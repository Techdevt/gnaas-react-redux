import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import {Cell, IconButton, Button, Textfield, Header, Layout, Content, Icon } from 'react-mdl';
import User from 'components/DashBarUser';
import Confirm from 'components/Confirm';
import { connect } from 'react-redux';
import AuthenticatedComponent from 'components/AuthenticatedComponent';
import request from 'superagent';
import { editUser, deleteImage } from 'actions/AuthActions';
import AutosizeInput from 'react-input-autosize';

class ContactDetails extends Component {
	static self = this;
	constructor(props) {
		super(props);
		const { user, type } = this.props;
		this.state = {
			homePhone: user.roles[type].homePhone,
			phone: user.roles[type].phone,
			location: user.location,
			address: user.address
		};

		this.currValues = Object.assign({},this.state);
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
		const _this = this;
		return (
			<div>
			{
				<div className="DashContent__inner">
		    		<Cell className="Settings__main" col={8} phone={4} tablet={8}>
		    			<h2 className="dash_title">Contact Information</h2>
		    			<div className="Settings__main--big">
		    				<div>
		    					<div className="inner-div">
		    						<h2 className="dash_title">Location</h2>
		    						<AutosizeInput type="text" name="location" value={this.state.location} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
		    					</div>
		    				</div>
		    					<div>
			    					<div className="inner-div">
			    						<h2 className="dash_title">Mobile No</h2>
			    						<AutosizeInput type="text" name="phone" value={this.state.phone} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
			    					</div>
			    					<div className="inner-div">
			    						<h2 className="dash_title">Telephone No</h2>
			    						<AutosizeInput type="text" name="homePhone" value={this.state.homePhone} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
			    					</div>
		    					</div>
		    					<div>
			    					<div className="inner-div Addresses">
			    						<h2 className="dash_title">Addresses <IconButton raised ripple className="Addresses_Add" name="add" onClick={this.handleAddressAdd}/></h2>
			    						<ul className="Address_List" ref="addresses">
				    						{
				    							this.state.address.map(function(item, index) {
				    								return (
				    									<li key={index}>
				    										<AutosizeInput type="text" 
				    										name="address"
				    										value={_this.state.address[index]} 
				    										onChange={_this.onFieldChange} 
				    										id={index}
				    										readOnly={true}
				    										onClick={_this.onInputClick}/>
				    										<div className="actions" style={{
				    											display: (item !== '') ? 'inline-block' : 'none'
				    										}}>
					    										<IconButton name="edit" raised ripple onClick={_this.handleAddressEdit.bind(_this, index)}/>
					    										<IconButton name="cancel" raised ripple onClick={_this.handleAddressDelete.bind(_this, index)}/>
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

export default AuthenticatedComponent(ContactDetails);


// <div>
// 	<div className="inner-div full">
// 		<h2 className="dash_title">Bio</h2>
// 		<textarea className="small-text" name="bio" value={this.state.bio} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick} rows="2"></textarea>
// 	</div>
// </div>