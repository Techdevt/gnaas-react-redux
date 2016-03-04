import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Header, Icon, Content, Button, Textfield } from 'react-mdl';
import Defer from 'promise-defer';

export default class DelegateModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalOpen: true,
			catName: this.props.catName || '',
			catDescription: this.props.catDescription || '',
		};
		this.$promise = Defer();
	}

	abort = () => {
		this.setState({
			isModalOpen: false
		});
		this.$promise.reject(false);
	};

	onChange = (evt) => {
		this.setState({[evt.target.name]: evt.target.value});
	};

	onSubmit = (evt) => {
		evt.preventDefault();
		this.setState({
			isModalOpen: false
		});
		this.$promise.resolve(this.state);
	};

	render() {
		return (
			<Modal isOpen={this.state.isModalOpen} className="Signup Category">
				<Header style={{height: '40px'}}>
					{
						(this.props.type === 'add' ) &&
						<h4 className="confirmTitle">Add Category</h4>
					}
					{
						(this.props.type === 'edit' ) &&
						<h4 className="confirmTitle">Edit Category</h4>
					}
					<Icon name="cancel" onClick={this.abort}/>
				</Header>
				<Content className="Signup__container--body">
					<form className="Signup__container--step" onSubmit={this.onSubmit}>
						<div className="Signup__container--body-fieldrow">
							<Textfield
							    label="Category Name"
							    floatingLabel
							    onChange={this.onChange}
							    name="catName"
							    required={true}
							    defaultValue={this.state.catName}
							/>
						</div>
						<div className="Signup__container--body-fieldrow">
							<Textfield
							    label="Description"
							    onChange={this.onChange}
							    name="catDescription"
							    required={true}
							    rows={3}
							    defaultValue={this.state.catDescription}
							/>
						</div>
						<div className="Signup__container--body-fieldrow actions">
							<Button raised primary type="submit" style={{
								margin: '20px auto'
							}}>Submit</Button>
						</div>
					</form>
				</Content>
			</Modal>
		);
	}
}