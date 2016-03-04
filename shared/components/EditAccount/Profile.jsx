import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import {Cell, IconButton, Button, Textfield, Header, Layout, Content, Icon, Spinner, Switch, Checkbox } from 'react-mdl';
import User from 'components/DashBarUser';
import Confirm from 'components/Confirm';
import { connect } from 'react-redux';
import AuthenticatedComponent from 'components/AuthenticatedComponent';
import request from 'superagent';
import { editUser, deleteImage, cleanAuthMessage  } from 'actions/AuthActions';
import { editUsers, cleanActionResult } from 'actions/UserActions';
import AutosizeInput from 'react-input-autosize';
import ActionResult from 'components/ActionResult';

@connect(state => ({
	isWaiting: state.Auth.get('isWaiting'), 
	actionWaiting: state.users.get('actionWaiting'),
	actionResult: state.users.get('actionResult'),
	message: state.Auth.get('message'),
	actionSuccess: state.users.get('actionSuccess'),
	authSuccess: state.Auth.get('authSuccess')
}))
export default class Profile extends Component {
	constructor(props) {
		super(props);
		const { user, type } = this.props;
		this.state = {
			firstName: user.roles[type].firstName,
			lastName: user.roles[type].lastName,
			username: user.username,
			email: user.email,
			title: user.roles[type].title,
			gender: user.roles[type].gender,
			companyName: user.roles[type].companyName,
			password: '******',
			permissions: user.roles[type].permissions,
			roles: user.roles[type].roles,
			modalIsOpen: false
		};
		this.currValues = Object.assign({}, this.state);
		this.possibleRoles = ['Customer Service', 'Inventory Management'];
		this.adminPermissions = ['adminAccounts', 'userAccounts'];
	}

	componentDidUpdate(prevProps, prevState) {
		this.props.setDirty();
	}

	componentWillUnmount() {
		this.props.unsetDirty();
	}

	onInputClick = (evt) => {
		evt.target.readOnly = false;
		evt.target.onblur = this.onLoseFocus.bind(this);
	};

	onLoseFocus = (evt) => {
		evt.target.readOnly = true;
	};

	onFieldChange = (evt) => {
		this.setState({
			[evt.target.name]: evt.target.value
		});
	};

	onPasswordClick = (evt) => {
		evt.target.type = 'text';
		evt.target.readOnly = false;
		evt.target.onblur = this.onPasswordLoseFocus.bind(this);
	};

	onPasswordLoseFocus = (evt) => {
		evt.target.readOnly = true;
		evt.target.type = 'password';
	};

	editImageClicked = (evt) => {
		const avatarReader = this.refs['avatarInput'];
		avatarReader.addEventListener('change', this.handleFiles, false);
		avatarReader.click();
	};

	deleteImageClicked = (evt) => {
		const { dispatch } = this.props;
		dispatch(deleteImage());
	};

	permissionTicked = (evt) => {
		return this.setState({
			permissions: [...this.state.permissions, {name: evt.target.name, permit: true}]
		});
	};

	permissionRemoved = (evt) => {
		const permissionName = evt.target.id;
		const found = JSON.parse(JSON.stringify(this.state.permissions)).findIndex((permission) => {
			return permission.name === permissionName;
		});
		return this.setState({
			permissions: [...this.state.permissions.slice(0, found), ...this.state.permissions.slice(found + 1)]
		})
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

	hasPermission = (permission, permissions) => {
		//permission object {name: , permit:}
		const found = permissions.findIndex((permission) => {
			return permission.name = permission;
		});
		return found !== -1;
	};

	handleFiles = (evt) => {
		evt.preventDefault();
		let fileReader = new FileReader();
		const avatar = evt.target.files[0];
		let displayedImage = ReactDOM.findDOMNode(this.refs['avatarImg']).children[0];

		displayedImage.file = avatar;
		let _this = this;
		fileReader.onload = (function(aImg){
			return function(e) { 
				aImg.src = e.target.result;
				_this.setState({
					avatar: avatar
				});
			};
		})(displayedImage);
		fileReader.readAsDataURL(avatar);
	};

	handleSubmit = () => {
		if(!this.props.$dirty) return;

		const { state, currValues } = this;
		const { dispatch, checks, user } = this.props;
		
		let formData = new FormData();
		Object.keys(state).forEach(function(key) {
			if((state[key] !== undefined) && (currValues[key] !== state[key])) {
				if(key === 'avatar') {
					formData.append(key, state[key]);
				} else {
					formData.append(key, JSON.stringify(state[key]));
				}
			} else if(!currValues.hasOwnProperty(key)) {
				if(key === 'avatar') {
					formData.append(key, state[key]);
				} else {
					formData.append(key, JSON.stringify(state[key]));
				}
			}
		});

		(!checks.isOwnAccount) ? 
			formData.append("acToEdit", JSON.stringify(user._id)): false;
		
		if(checks.isUserAccount) {
			dispatch(editUsers(formData));
		} else{
			dispatch(editUser(formData));
		}
		this.props.unsetDirty();
	};

	clearMessage = () => {
		const { dispatch } = this.props;
		dispatch(cleanAuthMessage());
	};

	clearActionResult = () => {
		const { dispatch } = this.props;
		dispatch(cleanActionResult());
	};

	render() {
		const { type, user, checks, currUserPermissions, actionResult, message, actionSuccess, authSuccess } = this.props;
		const passedAvatar = user.roles[type].avatarUrl[1] || user.roles[type].avatarUrl[0];
		const merchantAvatar = user.roles[type].avatarUrl[2] || user.roles[type].avatarUrl[0];

		return (
			<div>
			{
				(message || actionResult) &&
				<ActionResult type={(actionSuccess || authSuccess) ? 'success': 'failure'} onConfirm={
					() => {
						(message !== '') ? this.clearMessage(): false;
						(actionResult !== '') ? this.clearActionResult(): false;
					}
				} message={message || actionResult} isOpen={true}/>
			}
			{
				(type === 'shopper') &&
				<div className="DashContent__inner">
		    		<Cell className="Settings__main" col={8} phone={4} tablet={8}>
		    			<h2 className="dash_title">Basic Info</h2>
		    			<div className="Settings__main--big">
		    				<div>
		    					<div className="Settings--profile_avatar inner-div">
		    						<User className="avatar-icon" ref="avatarImg" passedAvatar={passedAvatar}/>
		    						<input type="file" ref="avatarInput" style={{display: 'none'}} accept="image/*"/>
		    						<div className="actions">
			    						<IconButton name="edit" onClick={this.editImageClicked} />
			    						<IconButton name="delete" onClick={this.deleteImageClicked}/>
		    						</div>
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
		    				{
		    					(checks.isUserAccount && this.hasPermission('userAccounts', JSON.parse(JSON.stringify(currUserPermissions)))) &&
		    					<div>
			    					<div className="inner-div">
			    						<h2 className="dash_title">Password</h2>
			    						<AutosizeInput type="password" name="password" value={this.state.password} onChange={this.onFieldChange} readOnly={true} onClick={this.onPasswordClick}/>
			    					</div>
			    				</div>
		    				}
		    				<div>
		    					<div className="inner-div">
		    						<h2 className="dash_title">Gender</h2>
		    						<AutosizeInput type="text" name="gender" value={this.state.gender} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
		    					</div>
		    					<div className="inner-div">
		    						<h2 className="dash_title">Title</h2>
		    						<AutosizeInput type="text" name="title" value={this.state.title} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
		    					</div>
		    				</div>
		    			</div>
		    			<Button raised accent className="Settings__action-btn" onClick={this.handleSubmit}>Update Account Settings 
		    			<Spinner singleColor={true} style={{
		    				display: (this.props.isWaiting || this.props.actionWaiting) ? 'inline-block' : 'none'
		    			}}/></Button>
		    		</Cell>
		    	</div>
			}
			{
				(type === 'merchant') &&
				<div className="DashContent__inner">
		    		<Cell className="Settings__main" col={8} phone={4} tablet={8}>
		    			<h2 className="dash_title">Basic Info</h2>
		    			<div className="Settings__main--big">
		    				<div>
		    					<div className="Settings--profile_avatar inner-div">
		    						<User className="avatar-icon merchant" ref="avatarImg" passedAvatar={passedAvatar}/>
		    						<input type="file" ref="avatarInput" style={{display: 'none'}} accept="image/*"/>
		    						<div className="actions">
			    						<IconButton name="edit" onClick={this.editImageClicked} />
			    						<IconButton name="delete" onClick={this.deleteImageClicked}/>
		    						</div>
		    					</div>
		    					<div className="inner-div">
			    						<h2 className="dash_title"> Company Name</h2>
			    						<AutosizeInput type="text" name="companyName" value={this.state.companyName} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
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
		    				{
		    					(checks.isUserAccount && this.hasPermission('userAccounts', JSON.parse(JSON.stringify(currUserPermissions)))) &&
		    					<div>
			    					<div className="inner-div">
			    						<h2 className="dash_title">Password</h2>
			    						<AutosizeInput type="password" name="password" value={this.state.password} onChange={this.onFieldChange} readOnly={true} onClick={this.onPasswordClick}/>
			    					</div>
			    				</div>
		    				}
		    			</div>
		    			<Button raised accent className="Settings__action-btn" onClick={this.handleSubmit}>Update Account Settings 
		    			<Spinner singleColor={true} style={{
		    				display: (this.props.isWaiting || this.props.actionWaiting) ? 'inline-block' : 'none'
		    			}}/></Button>
		    		</Cell>
		    	</div>
			}
			{
				(type === 'delegate') &&
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
			    					{
			    						(checks.isAccountDelegate || this.hasPermission('userAccounts', JSON.parse(JSON.stringify(currUserPermissions)))) &&
			    						<div>
				    						<div className="inner-div">
					    						<h2 className="dash_title">Password</h2>
					    						<AutosizeInput type="password" name="password" value={this.state.password} onChange={this.onFieldChange} readOnly={true} onClick={this.onPasswordClick}/>
					    					</div>
				    					</div>
			    					}
			    					{
			    						(checks.isAccountDelegate || this.hasPermission('userAccounts', JSON.parse(JSON.stringify(currUserPermissions)))) &&
					    				<div>
					    					<div className="inner-div Roles">
					    						<h2 className="dash_title">Roles</h2>
					    						<div className="Role_Add" style={{
					    							display: (this.possibleRoles.length === this.state.roles.length) ? 'none' : 'block'
					    						}}>
						    						<div className="Role_Select">
						    							<label>Add Role</label>
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
						    							this.state.roles.map((role, index) => {
						    								return (
						    									<li key={index} className="Role_Item">
						    										<Switch id={role.name} key={index} checked={role.permit} onChange={this.roleRemoved}>{role.name}</Switch>
						    									</li>
						    								);
						    							})
						    						}
					    						</ul>
					    					</div>
					    				</div>
				    				}
				    			</div>
				    			<Button raised accent className="Settings__action-btn" onClick={this.handleSubmit}>Update Delegate 
				    			<Spinner singleColor={true} style={{
				    				display: (this.props.isWaiting || this.props.actionWaiting) ? 'inline-block' : 'none'
				    			}}/></Button>
				    		</Cell>
				    	</div>
			}
			{
				( type === 'admin' ) &&
				<div className="DashContent__inner">
		    		<Cell className="Settings__main" col={10} phone={4} tablet={8}>
		    			<h2 className="dash_title">Basic Info</h2>
		    			<div className="Settings__main--big">
		    				<div>
		    					<div className="Settings--profile_avatar inner-div">
		    						<User className="avatar-icon" ref="avatarImg" passedAvatar={passedAvatar}/>
		    						<input type="file" ref="avatarInput" style={{display: 'none'}} accept="image/*"/>
		    						<div className="actions">
			    						<IconButton name="edit" onClick={this.editImageClicked} />
			    						<IconButton name="delete" onClick={this.deleteImageClicked}/>
		    						</div>
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
		    				{
	    						(this.hasPermission('adminAccounts', JSON.parse(JSON.stringify(currUserPermissions)))) &&
			    				<div>
			    					<div className="inner-div Roles">
			    						<h2 className="dash_title">Permissions</h2>
			    						<div className="Role_Add" style={{
			    							display: (this.adminPermissions.length === this.state.permissions.length) ? 'none' : 'block'
			    						}}>
				    						<div className="Role_Select">
				    							<label>Add Permission</label>
				    							{
				    								this.adminPermissions.filter((pPermission) => {
				    									const isEqual = !!JSON.parse(JSON.stringify(this.state.permissions)).find((element) => {
				    										return pPermission === element.name
				    									});
				    									return !isEqual;
				    								}).map((permission, index) => {
				    									return (
				    										<Checkbox key={index} name={permission} label={permission} ripple onChange={this.permissionTicked}/>
				    									);
				    								})
				    							}
				    							<hr />
				    						</div>
			    						</div>
			    						<ul className="Role_List" ref="permissions">
				    						{
				    							JSON.parse(JSON.stringify(this.state.permissions)).map((permission, index) => {
				    								return (
				    									<li key={index} className="Role_Item">
				    										<Switch id={permission.name} key={index} checked={permission.permit} onChange={this.permissionRemoved}>{permission.name}</Switch>
				    									</li>
				    								);
				    							})
				    						}
			    						</ul>
			    					</div>
			    				</div>
		    				}
		    			</div>
		    			<Button raised accent className="Settings__action-btn" onClick={this.handleSubmit}>Update Admin 
		    			<Spinner singleColor={true} style={{
		    				display: (this.props.isWaiting || this.props.actionWaiting) ? 'inline-block' : 'none'
		    			}}/></Button>
		    		</Cell>
		    	</div>
			}
		</div>	
		);
	}
}