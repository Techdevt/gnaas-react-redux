import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { IconButton, Button } from 'react-mdl';
import { connect } from 'react-redux';

@connect(state => ({}))
export default class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			markup: '',
			published: false,
			files: []
		};
	}

	markupChanged = (evt) => {
		this.setState({
			markup: evt.target.value
		});
	};

	goToUrl = (path, evt) => {
		const { history } = this.props;
		history.push(path);
	};

	savePost = () => {

	};

	publishPost = () => {

	};

	addImages = (files) => {
		files.forEach((file) => {
			const found = this.state.files.findIndex((item) => {
				return item.name === file.name;
			});

			if(found === -1) {
				this.setState({
				files: [...this.state.files, file]
				});
			}
		});
	};

	removeImage = (index) => {
		this.setState({
			files: [ ...this.state.files.slice(index, 1), 
			...this.state.files.slice(index + 1) ]
		});
	};

	insertImage = (index) => {
		const image = this.state.files[index];
		this.setState({
			markup: `${ this.state.markup } \n ![attachment-${index}](${image.preview} =100x80) \n`
		});
	};


	render() {
		//add delete button
		return (
			<div className="EditorContainer">
				<div className="EditorContainer__Header">
					<Button name="publish" onClick={this.publishPost} raised ripple style={{textTransform: 'capitalize'}}>Publish</Button>
					<Button onClick={this.goToUrl.bind(this, '/dashboard/post')} raised ripple style={{textTransform: 'capitalize'}}>Editor</Button>
					<div className="EditorContainer__Header-actions">
						<IconButton name="image" onClick={this.goToUrl.bind(this, '/dashboard/post/images')}/>
						<IconButton name="settings" onClick={this.goToUrl.bind(this, '/dashboard/post/settings')}/>
						<IconButton name="save" onClick={this.savePost}/>
					</div>
				</div>
				{
					React.cloneElement(this.props.children, {
						markup: this.state.markup,
						markupChanged: this.markupChanged,
						published: this.published,
						files: this.state.files,
						addImages: this.addImages,
						insertImage: this.insertImage
					})
				}
			</div>
		);
	}
}