import React, { PropTypes, Component } from 'react';
import { Tabs, Tab, Content } from 'react-mdl';

export default class Index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTab: 0,
			tabs: ['', 'categories', 'brands', 'options'],
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
		this.navigate(tabId);
	};

	navigate = (tabId) => {
		this.setState({
			selectedTab: tabId
		});
		const { history } = this.props;
		const route = `/dashboard/catalog/${this.state.tabs[tabId]}`;
		history.pushState(null, route);
	};

	render() {
		const _this = this;
		
		return (
			<div className="Catalog">	
				<Tabs activeTab={this.state.selectedTab} onChange={this.selectTab} ripple className="Settings__tabs">
			        <Tab>Goods</Tab>
			        <Tab>Categories</Tab>
			        <Tab>Brands</Tab>
			        <Tab>Options</Tab>
			    </Tabs>
			    <Content className="Settings__Content">
			    	{ this.props.children }
			    </Content>
			</div>
		);
	}
}