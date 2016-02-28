import React, {Component, PropTypes} from 'react';
import {Header, Textfield, Badge, Icon, IconButton} from 'react-mdl';
import {Link} from 'react-router';
import { connect } from 'react-redux';

export default class DashBar extends Component {
	render() {
        // const { user, dispatch } = this.props;
		return (
            <Header className="DashBar" title={this.props.title} scroll>
                 <div className="DashBar__right">
             		<Textfield
             		label="search something here..."
                    inputClassName="DashBar__right-search"
                    expandable
                    expandableIcon="search"
                	/>
                	<Badge text="1">
					    <Icon name="announcement" />
					</Badge>
                    <IconButton name="account_circle" style={{marginTop: '-15px'}}/>
                 </div>
            </Header>
        );
	}
}