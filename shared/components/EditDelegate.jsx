import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Cell, IconButton, Button, Textfield, Header, Layout, Content, Icon, Spinner, Switch, Checkbox } from 'react-mdl';
import AuthenticatedComponent from 'components/AuthenticatedComponent';
import AutosizeInput from 'react-input-autosize';
import { editUser } from 'actions/AuthActions';
import ActionResult from 'components/ActionResult';

@connect(state => ({delegates: state.Auth.toJSON().user.roles.merchant.delegates, isWaiting: state.Auth.get('isWaiting'), message: state.Auth.get('message')}))
class EditDelegate extends Component {
	constructor(props) {
		super(props);
		const { params, delegates } = this.props;
		const id = params.id;
		const user = delegates[id];
		this.state = {
			roles: user.roles.delegate.roles,
			address: user.address,
			firstName: user.roles.delegate.firstName,
			lastName: user.roles.delegate.lastName,
			title: user.roles.delegate.title,
			email: user.email,
			location: user.location,
			password: 'new password',
			username: user.username
		};

		this.currValues = this.state;
		this.possibleRoles = ['Customer Service', 'Inventory Management'];
		this.$dirty = false;
		this.user = user;
	}

	componentDidUpdate() {
		Object.keys(this.state).map((key) => {
			if(this.currValues.hasOwnProperty(key)) {
				if(this.state[key] !== this.currValues[key]) {
					this.$dirty = true;
				}
			}
		});
	}

	onInputClick = (evt) => {
		evt.target.readOnly = false;
		evt.target.onblur = this.onLoseFocus.bind(this);
	};

	onPasswordClick = (evt) => {
		evt.target.type = 'text';
		evt.target.readOnly = false;
		evt.target.onblur = this.onPasswordLoseFocus.bind(this);
	};

	onLoseFocus = (evt) => {
		evt.target.readOnly = true;
	};

	onPasswordLoseFocus = (evt) => {
		evt.target.readOnly = true;
		evt.target.type = 'password';
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

	roleTicked = (evt) => {
		return this.setState({
			roles: [...this.state.roles, {name: evt.target.name, permit: true}]
		});
	};

	roleRemoved = (evt) => {
		const roleName = evt.target.id;
		const found = this.state.roles.findIndex((role) => {
			return role.name === roleName;
		});
		return this.setState({
			roles: [...this.state.roles.slice(0, found), ...this.state.roles.slice(found + 1)]
		})
	};

	handleSubmit = () => {
		const { state, currValues } = this;
		const { dispatch } = this.props;
		
		let formData = new FormData();
		Object.keys(state).forEach(function(key) {
			if((state[key] !== undefined) && (currValues[key] !== state[key])) {
				formData.append(key, JSON.stringify(state[key]));
			} else if(!currValues.hasOwnProperty(key)) {
				formData.append(key, JSON.stringify(state[key]));	
			}
		});
		formData.append("acToEdit", JSON.stringify(this.user._id));

		dispatch(editUser(formData));
	};

	render() {
		const { message } = this.props;
		const _this = this;
		return  (
			<div className="Settings">
				{
					message &&
					<ActionResult isOpen={ message !== '' } message={ message } type="success"/>
				}
				<div className="Settings__Content EditDelegate grid">
					<div className="DashContent__inner">
				    		<Cell className="Settings__main" col={10} phone={4} tablet={8}>
				    			<h2 className="dash_title">Delegate Details</h2>
				    			<div className="Settings__main--big">
				    				<div>
				    					<div className="inner-div">
				    						<h2 className="dash_title">Title</h2>
				    						<AutosizeInput type="text" name="title" value={this.state.title} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
				    					</div>
				    					<div className="inner-div">
				    						<h2 className="dash_title">Name</h2>
				    						<AutosizeInput type="text" name="firstName" value={this.state.firstName} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
				    						<AutosizeInput type="text" name="lastName" value={this.state.lastName} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
				    					</div>
				    				</div>
				    				<div>
				    					<div className="inner-div">
				    						<h2 className="dash_title">Username</h2>
				    						<AutosizeInput type="text" name="username" value={this.state.username} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
				    					</div>
				    					<div className="inner-div">
				    						<h2 className="dash_title">Email Id</h2>
				    						<AutosizeInput type="email" name="email" value={this.state.email} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
				    					</div>
				    				</div>
				    				<div>
				    					<div className="inner-div">
				    						<h2 className="dash_title">Location</h2>
				    						<AutosizeInput type="text" name="location" value={this.state.location} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
				    					</div>
				    					<div className="inner-div">
				    						<h2 className="dash_title">Password</h2>
				    						<AutosizeInput type="password" name="password" value={this.state.password} onChange={this.onFieldChange} readOnly={true} onClick={this.onPasswordClick}/>
				    					</div>
				    				</div>
				    				<div>
				    					<div className="inner-div Roles">
				    						<h2 className="dash_title">Roles</h2>
				    						<div className="Role_Add" style={{
				    							display: (this.possibleRoles.length === this.state.roles.length) ? 'none' : 'block'
				    						}}>
					    						<div className="Role_Select">
					    							<label>Add Roles</label>
					    							{
					    								this.possibleRoles.filter((pRole) => {
					    									const isEqual = !!this.state.roles.find((element) => {
					    										return pRole === element.name
					    									});
					    									return !isEqual;
					    								}).map((role, index) => {
					    									return (
					    										<Checkbox key={index} name={role} label={role} ripple onChange={this.roleTicked}/>
					    									);
					    								})
					    							}
					    							<hr />
					    						</div>
				    						</div>
				    						<ul className="Role_List" ref="roles">
					    						{
					    							this.state.roles.map(function(role, index) {
					    								return (
					    									<li key={index} className="Role_Item">
					    										<Switch id={role.name} key={index} checked={role.permit} onChange={_this.roleRemoved}>{role.name}</Switch>
					    									</li>
					    								);
					    							})
					    						}
				    						</ul>
				    					</div>
				    					<div className="inner-div Addresses">
				    						<h2 className="dash_title">Addresses <IconButton raised ripple className="Addresses_Add" name="add" onClick={_this.handleAddressAdd}/></h2>
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
				    			<Button raised accent className="Settings__action-btn" onClick={this.handleSubmit}>Update Delegate 
				    			<Spinner singleColor={true} style={{
				    				display: this.props.isWaiting ? 'inline-block' : 'none'
				    			}}/></Button>
				    		</Cell>
				    	</div>
			    	</div>
		    	</div>
		);
	}
}

export default AuthenticatedComponent(EditDelegate, 'merchant');