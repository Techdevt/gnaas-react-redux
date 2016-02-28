import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Cell, Button, IconButton, Tabs, Tab} from 'react-mdl';
import User from 'components/DashBarUser';
import Confirm from 'components/Confirm';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import * as UserActions from 'actions/UserActions';

@asyncConnect({
	promise: (params, helpers) => {
		//load only on server..to prevent duplicates
		const { isLoaded } = helpers.store.getState().users.toJSON();
		const type = Object.keys(helpers.store.getState().Auth.toJSON().user.roles)[0];
		
		if(!isLoaded && (type === 'admin')) return helpers.store.dispatch(UserActions.getUsers());
	}
})
@connect(state => ({user: state.Auth.toJSON().user, users: state.users.toJSON().data}))
export default class Settings extends Component{
	constructor(props) {
		super(props);
		this.state = {
			selectedTab: 0,
			tabs: ['profile', 'contact-details', 'billing'],
			$dirty: false
		};
	}

	componentWillMount() {
		const { location, user, history } = this.props;
		let activeState = location.pathname.split('/')[4] || 'profile';
		const { id, type } = location.query;

		this.currUserType = this.getType(user);

		const isOwnAccount = ( id === user._id);
		const isAccountDelegate = !isOwnAccount && this.checkDelegate();
		const isUserAccount = !isOwnAccount && this.checkUser();

		const userToEdit = this.getUser({isOwnAccount, isAccountDelegate, isUserAccount});
		this.type = type;
		this.user = userToEdit;
		this.checks = {isOwnAccount, isAccountDelegate, isUserAccount};
		
		this.setState({
			selectedTab: this.state.tabs.indexOf(activeState)
		});
	}

	checkDelegate = () => {
		const { user, location } = this.props;
		const { id, type } = location.query;



		if( type !== 'delegate' ) return false;
		if( this.currUserType !== 'merchant' ) return false;

		if(user.roles.merchant.delegates.length === 0) return false;

		const found = user.roles.merchant.delegates.findIndex((delegate) => {
			return id === delegate._id;
		});

		this.delegatePos = found;

		return found !== -1;
	};

	checkUser = () => {
		const { user, location, users } = this.props;
		const { id, type } = location.query;

		if( !type in ['admin', 'merchant', 'delegate', 'shopper'] ) return false;
		const index = users.findIndex((item) => {
			return item._id === id;
		});

		this.userIndex = (index !== -1) ? index: undefined;
		return index !== -1;
	};

	getType = (user) => {
		return Object.keys(user.roles)[0];
	};

	getUser = (params) => {
		const { user, users } = this.props;
		if(params.isOwnAccount) {
			return this.props.user;
		} else if(params.isAccountDelegate && (this.delegatePos !== undefined)) {
			return user.roles.merchant.delegates[this.delegatePos];
		} else if( params.isUserAccount && (this.userIndex !== undefined)){
			return users[this.userIndex];
		}
		return undefined;
	};

	selectTab = (tabId) => {
		if(this.state.selectedTab === tabId) return;

		if(this.state.$dirty) {
			let wrapper = document.body.appendChild(document.createElement('div'));
			let modalComponent = ReactDOM.render(<Confirm description="You have unsaved data. Leave without saving?"/>, wrapper);

			function cleanup() {
				ReactDOM.unmountComponentAtNode(wrapper)
	    		setTimeout(() => wrapper.remove());
			}

			modalComponent.$promise.promise.always(cleanup);

			modalComponent.$promise
					.promise
					.then(() => {
						this.navigate(tabId)
					})
					.catch(() => {});
		}else {
			this.navigate(tabId);
		}
	};

	navigate = (tabId) => {
		this.setState({
			selectedTab: tabId
		});
		const { history, location } = this.props;
		const { id, type } = location.query;
		const route = `/dashboard/users/edit/${this.state.tabs[tabId]}?type=${type}&id=${id}`;
		history.pushState(null, route);
	};

	setDirty = () => {
		this.setState({
			$dirty: true
		});
	};

	unsetDirty = () => {
		this.setState({
			$dirty: false
		});
	};

	render() {
		const { type } = this;
		const { location: { query: { id }}} = this.props;
		
		return (
			<div className="Settings">
				{
					( type === 'shopper' || type === 'delegate' || type === 'admin') &&
					<Tabs activeTab={this.state.selectedTab} onChange={this.selectTab} ripple className="Settings__tabs">
				        <Tab>Profile</Tab>
				        <Tab>Contact Details</Tab>
				    </Tabs>
				}
				{
					( type === 'merchant' ) &&
					<Tabs activeTab={this.state.selectedTab} onChange={this.selectTab} ripple className="Settings__tabs">
				        <Tab>Profile</Tab>
				        <Tab>Contact Details</Tab>
				        <Tab>Billings</Tab>
				    </Tabs>
				}
			    <section className="Settings__Content grid">
			    	{ this.props.children && React.cloneElement( this.props.children, {
			    		$dirty: this.state.$dirty,
			    		setDirty: this.setDirty,
			    		unsetDirty: this.unsetDirty,
			    		user: this.user,
			    		acToEdit: (!this.checks.isOwnAccount) ? id : undefined,
			    		checks: this.checks,
			    		type: this.type,
			    		currUserType: this.currUserType,
			    		currUserPermissions: (this.currUserType === 'admin') ? this.props.user.roles.admin.permissions : []
			    	}) }
			    </section>
			</div>
		);
	}
}