import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { FABButton, Icon, Content, Grid, Cell, IconButton } from 'react-mdl';
import CategoryModal from 'components/CategoryModal';
import { createCategory, editCategory, deleteCategory, getCategories, clearActions } from 'actions/CategoryActions';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect({
	promise: (params, helpers) => {
		//load only on server..to prevent duplicates
		const { isLoaded } = helpers.store.getState().Categories.toJSON();
		if(!isLoaded) return helpers.store.dispatch(getCategories());
	}
})
@connect(state => ({
	actionWaiting: state.Categories.toJSON().actionWaiting,
	actionSuccess: state.Categories.toJSON().actionSuccess,
	categories: state.Categories.toJSON().data
}))
export default class Categories extends Component {
	constructor(props) {
		super(props);
	}

	addCategory = () => {
		const { dispatch } = this.props;
		this.openCategoryModal('', {type: 'add'})
			.then((res) => {
				dispatch(createCategory(res));
			}, (err) => {});
	};

	openCategoryModal = (message, options={}) => {
		const props = {message, ...options};
		const mountDiv = document.body.appendChild(document.createElement('div'));
		const modalElement = ReactDOM.render(<CategoryModal {...props} {...this.props}/>, mountDiv);

		function cleanup() {
			ReactDOM.unmountComponentAtNode(mountDiv)
    		setTimeout(() => mountDiv.remove());
		}

		modalElement.$promise.promise.always(cleanup);

		return modalElement.$promise.promise;
	};

	editCat = (id, evt) => {
		const { dispatch, categories } = this.props;
		const index = this.getIndex(id);

		this.openCategoryModal('', {type: 'edit',
				catName: categories[index].catName,
				catDescription: categories[index].catDescription
			})
			.then((res) => {
				dispatch(editCategory({...res, id}));
			}, (err) => {});
	};

	getIndex = (id) => {
		const { categories } = this.props;
		const index = categories.findIndex((item) => {
			return item._id === id;
		});
		return index;
	};

	deleteCat = (id, evt) => {
		const { dispatch } = this.props;
		dispatch(deleteCategory(id));
	};

	render() {
		const { categories } = this.props;
		return (
			<div className="Delegates">
				<div className="Delegates__ActionBar">
					<div className="Delegates__ActionBar_inner grid">
						<div className="Delegates__ActionBar_right">
							<FABButton colored raised onClick={this.addCategory} mini>
								<Icon name="add"/>
							</FABButton>
						</div>
					</div>
				</div>
				<Content className="Delegates_List">
					<div className="grid">
						<Grid className="labelHeader">
							<Cell col={3} className="item">
								<span>Name</span>
							</Cell>
							<Cell col={3} className="item">
								<span>Description</span>
							</Cell>
							<Cell col={3} className="item">
								<span>Modified</span>
							</Cell>
							<Cell col={3}>
								
							</Cell>
						</Grid>
						{
							categories.map((category, index) => {
								const date = new Date(category.dateCreated).toLocaleString();
								return (
									<Grid className="Delegate__Item" key={index}>
										<Cell col={3} className="Delegate__Item_subcontainer">
											<Icon name="book" className="Delegate__Item_avatar icon"/> 
											<span className="Delegate__Item_name">{category.catName}</span>
										</Cell>
										<Cell col={3} className="Delegate__Item_subcontainer description">
											<span className="Delegate__Item_name">{category.catDescription}</span>
										</Cell>
										<Cell col={3} className="Delegate__Item_subcontainer">
											<span className="Delegate__Item_email">{date}</span>
										</Cell>
										<Cell col={3} className="Delegate__Item_subcontainer Delegate__Item_actions">
											<div className="inner">
												<IconButton onClick={this.editCat.bind(this, category._id)} name="edit"/>
												<IconButton onClick={this.deleteCat.bind(this, category._id)} name="delete"/>
											</div>
										</Cell>
									</Grid>
								);
							})
						}
					</div>
				</Content>
			</div>
		);
	}
}