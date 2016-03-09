import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import {Cell, IconButton, Button, Textfield, Header, Layout, Content, Icon, Spinner } from 'react-mdl';
import User from 'components/DashBarUser';
import Confirm from 'components/Confirm';
import { connect } from 'react-redux';
import AuthenticatedComponent from 'components/AuthenticatedComponent';
import request from 'superagent';
import { editUser, deleteImage } from 'actions/AuthActions';
import AutosizeInput from 'react-input-autosize';

@connect(state => ({isWaiting: state.Auth.get('isWaiting')}))
class Profile extends Component {
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
			affiliatedInstitution: user.roles[type].affiliatedInstitution,
			residingCountry: user.roles[type].residingCountry,
			modalIsOpen: false
		};

		this.currValues = Object.assign({}, this.state);
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

	editImageClicked = (evt) => {
		const avatarReader = this.refs['avatarInput'];
		avatarReader.addEventListener('change', this.handleFiles, false);
		avatarReader.click();
	};

	deleteImageClicked = (evt) => {
		const { dispatch } = this.props;
		dispatch(deleteImage());
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
		const { dispatch } = this.props;
		
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

		dispatch(editUser(formData));
		this.props.unsetDirty();
	};

	render() {
		const { type, user } = this.props;
		const passedAvatar = user.roles[type].avatarUrl[1] || user.roles[type].avatarUrl[0];
		const merchantAvatar = user.roles[type].avatarUrl[2] || user.roles[type].avatarUrl[0];
		return (
			<div>
			{
				(type === 'student') &&
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
		    				display: this.props.isWaiting ? 'inline-block' : 'none'
		    			}}/></Button>
		    		</Cell>
		    	</div>
			}
			{
				(type === 'alumni') &&
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
		    						<h2 className="dash_title">Name</h2>
		    						<AutosizeInput type="text" name="firstName" value={this.state.firstName} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
		    						<AutosizeInput type="text" name="lastName" value={this.state.lastName} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
		    					</div>
		    				</div>
		    				<div>
		    					<div className="inner-div">
			    						<h2 className="dash_title">Affiliated Institution</h2>
			    						<AutosizeInput type="text" name="affiliatedInstitution" value={this.state.affiliatedInstitution} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
			    				</div>
		    					<div className="inner-div">
		    						<h2 className="dash_title">Residing Country</h2>
		    						<AutosizeInput type="text" name="residingCountry" value={this.state.residingCountry} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
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
		    			</div>
		    			<Button raised accent className="Settings__action-btn" onClick={this.handleSubmit}>Update Account Settings 
		    			<Spinner singleColor={true} style={{
		    				display: this.props.isWaiting ? 'inline-block' : 'none'
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
		    			</div>
		    			<Button raised accent className="Settings__action-btn" onClick={this.handleSubmit}>Update Admin 
		    			<Spinner singleColor={true} style={{
		    				display: this.props.isWaiting ? 'inline-block' : 'none'
		    			}}/></Button>
		    		</Cell>
		    	</div>
			}
		</div>	
		);
	}
}

export default AuthenticatedComponent(Profile);