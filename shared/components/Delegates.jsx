import React, { PropTypes, Component} from 'react';
import { IconButton, Content, FABButton, Icon, Textfield, Menu, MenuItem } from 'react-mdl';
import ReactDOM from 'react-dom';
import DelegateModal from 'components/DelegateModal';
import { createUser } from 'actions/AuthActions';
import { connect } from 'react-redux';
import ActionResult from 'components/ActionResult';
import User from 'components/DashBarUser';

class Delegates extends Component {
	constructor(props) {
		super(props);
	}

	createDelegate = () => {
		const { user, type, dispatch, message } = this.props;
		const merchantId = user.roles[type]._id;
		//companyName
 
		this.openDelegateModal()
			.then((delegateDetails) => {
				dispatch(createUser({...delegateDetails, action: {
		            type: 'CREATE_DELEGATE'
		        }, 
		    	merchantId: merchantId
		    	}));
			})
			.catch(err => console.log(err));
	};

	openDelegateModal = (message, options={}) => {
		const props = {message, ...options};
		const mountDiv = document.body.appendChild(document.createElement('div'));
		const modalElement = ReactDOM.render(<DelegateModal {...props} {...this.props}/>, mountDiv);

		function cleanup() {
			ReactDOM.unmountComponentAtNode(mountDiv)
    		setTimeout(() => mountDiv.remove());
		}

		modalElement.$promise.promise.always(cleanup);

		return modalElement.$promise.promise;
	};

	editDelegate = (id, evt) => {
		const { history } = this.props;
		history.pushState(null, `/dashboard/delegates/${id}`);
	};

	render() {
		const { message, delegates } = this.props;
		return (
			<div className="Delegates">
			{
				message && 
				<ActionResult isOpen={ message !== '' } message={ message } type="success"/>
			}
				<div className="Delegates__ActionBar">
					<div className="Delegates__ActionBar_inner grid">
						<div className="Delegates__ActionBar_right">
							<FABButton colored raised onClick={this.createDelegate} mini>
								<Icon name="add"/>
							</FABButton>
						</div>
					</div>
				</div>
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
	                                <MenuItem>Customer Service</MenuItem>
                                    <MenuItem>Inventory Management</MenuItem>
	                            </Menu>
                            </div>
						</div>
						{
							delegates.map((user, index) => {
								return (
									<div className="Delegate__Item" key={index} onClick={this.editDelegate.bind(null, index)}>
										<div className="Delegate__Item_subcontainer">
										<User passedAvatar={user.roles.delegate.avatarUrl[1] || user.roles.delegate.avatarUrl[0]} className="Delegate__Item_avatar" />
										<span className="Delegate__Item_name">{`${user.roles.delegate.firstName} ${user.roles.delegate.lastName}`}</span>
										</div>
										<div className="Delegate__Item_subcontainer">
											<span className="Delegate__Item_email">{user.email}</span>
										</div>
										<div className="Delegate__Item_subcontainer">
											{
												user.isActive &&
													<span className="Delegate__Item_active">
													<i className="circle active"></i> active
													</span>
											}
											{
												!user.isActive &&
													<span className="Delegate__Item_active">
													<i className="circle inactive"></i> inactive
													</span>
											}
										</div>
										<div className="Delegate__Item_subcontainer Delegate__Item_actions">
											<IconButton name="edit"/>
											<IconButton name="delete"/>
										</div>
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

const mapStateToProps = (state) => ({
	message: state.Auth.get('message'),
	delegates: state.Auth.toJSON().user.roles.merchant.delegates || []
});
//make authenticated component for only merchants
export default connect(mapStateToProps)(Delegates);;