import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Cell, Button, IconButton, Tabs, Tab} from 'react-mdl';
import User from 'components/DashBarUser';
import Confirm from 'components/Confirm';

export default class Settings extends Component{
	constructor(props) {
		super(props);
		this.state = {
			selectedTab: 0,
			tabs: ['', 'contact-details', 'billing'],
			$dirty: false
		};
	}

	componentWillMount() {
		const { location } = this.props;
		let activeState = location.pathname.split('/')[3] || '';
		this.setState({
			selectedTab: this.state.tabs.indexOf(activeState)
		});
	}

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
		const { history } = this.props;
		const route = `/dashboard/settings/${this.state.tabs[tabId]}`;
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
		const { type } = this.props;
		const _this = this;
		return (
			<div className="Settings">	
				{
					( type === 'shopper' || type === 'admin' || type === 'delegate') &&
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
			    		$dirty: _this.state.$dirty,
			    		setDirty: _this.setDirty,
			    		unsetDirty: _this.unsetDirty
			    	}) }
			    </section>
			</div>
		);
	}
}