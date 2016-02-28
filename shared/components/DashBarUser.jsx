import React, { PropTypes, Component} from 'react';
import { connect } from 'react-redux';

@connect(state => ({user: state.Auth.toJSON().user}))
export default class DashBarUser extends Component {
	constructor(props) {
		super(props);
		const { user } = this.props;
		this.type = Object.keys(user.roles)[0];
	}

	render() {
		const { user, passedAvatar } = this.props;
		const avatar = user.roles[this.type].avatarUrl;
		let avatarUrl = passedAvatar || avatar[0];
		
		return (
			<div className="DashBarUser" style={{display: 'inline-block'}}>
				{
					avatarUrl && <img className={this.props.className || 'AppBarUser__avatar'} src={avatarUrl}/>
                }
			</div>
		);
	}
}