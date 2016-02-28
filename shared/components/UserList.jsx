import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { FABButton, Content, IconButton, Menu, MenuItem, Textfield } from 'react-mdl';
import AuthenticatedComponent from 'components/AuthenticatedComponent';
import User from 'components/DashBarUser';

class UserList extends Component {
	static propTypes = {
		users: PropTypes.array.isRequired
	};

	editUser = (index, evt) => {
		const { users, history } = this.props;
		const user = users[index];

		let type = this.getType(user);

		history.push(`/dashboard/users/edit/profile?type=${type}&id=${user._id}`);
	};

	getType = (user) => {
		return Object.keys(user.roles)[0];
	};

	render() {
		const { users } = this.props;

		return (
			<div className="Delegates">
				<Content className="Delegates_List">
					<div className="grid">
						<div className="Delegate__Collection_actions">
							<Textfield
							    onChange={() => {}}
							    label="Search"
							    expandable
							    expandableIcon="search"
							    className="search"
							/>
							<div className="filter">
                               <label>Filter</label>
                               <IconButton id="filter-menu" name="keyboard_arrow_down"/>
                               <Menu target="filter-menu" ripple>
	                                <MenuItem>Delegates</MenuItem>
                                    <MenuItem>Merchants</MenuItem>
                                    <MenuItem>Admins</MenuItem>
	                            </Menu>
                            </div>
						</div>
						{
							users.map((user, index) => {
								return (
									<div className="Delegate__Item" key={index} onClick={this.editUser.bind(this, index)}>
										<span>{user.email}</span>
									</div>
								);
							})
						}
					</div>
				</Content>
			</div>
		);
	}
}

export default AuthenticatedComponent(UserList);