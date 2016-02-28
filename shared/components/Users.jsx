import React, { PropTypes, Component } from 'react';
import * as UserActions from 'actions/UserActions';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import UserList from 'components/UserList';


@asyncConnect({
	promise: (params, helpers) => {
		//load only on server..to prevent duplicates
		const { isLoaded } = helpers.store.getState().users.toJSON();
		if(!isLoaded) return helpers.store.dispatch(UserActions.getUsers());
	}
})
@connect(state => ({users: state.users.toJSON().data}))
export default class Users extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { users } = this.props;
		
		return(
			<div>
				<UserList users={users} history={this.props.history}/>
			</div>
		);
	}
}