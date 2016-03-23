import React, { PropTypes, Component } from 'react';
import { Textfield, Button } from 'react-mdl';

export default class Settings extends Component {

	constructor(props) {
		super(props);
	}

	selectHeaderImage = (path, evt) => {
		const { history } = this.props;
		history.push(`${path}?ref=header`);
	};

	render() {
		return (
			<div className="PostSettings">
				<div className="PostSettings__section">
					<h3>Title</h3>
					<div className="PostSettings__text">
						<Textfield
							label="Title..."
							value={this.props.title}
							style={{width: '100%'}}
							onChange={this.props.fieldChanged}
							name="title"
						/>
					</div>
				</div>

				<div className="PostSettings__section">
					<h3>Abstract</h3>
					<div className="PostSettings__abstract PostSettings__text">
						<Textfield
							label="post abstract(summary)"
						    rows={5}
						    value={this.props.abstract}
						    style={{width: '100%'}}
						    onChange={this.props.fieldChanged}
						    name="abstract"
						/>
					</div>
				</div>

				<div className="PostSettings__section">
					<h3>Header Image</h3>
					<div style={{padding: '20px'}}>
						<Button raised ripple style={{'marginRight': '10px'}} onClick={this.selectHeaderImage.bind(this, '/dashboard/post/images')}>Select</Button>
						<span>{ (this.props.headerImage) ? ( this.props.headerImage.name || this.props.headerImage ) : 'Not set' }</span>
					</div>
				</div>

				<div className="PostSettings__section">
					<h3>Tags</h3>
					<div className="PostSettings__text">
						<Textfield
							label="Tags..."
							style={{width: '100%'}}
							value={this.props.tags}
							onChange={this.props.fieldChanged}
							name="tags"
						/>
					</div>
				</div>

				<div className="PostSettings__section">
					<h3>Read Next</h3>
					<div className="PostSettings__text">
						<Textfield
							label="read next..."
							value={this.props.readNext}
							style={{width: '100%'}}
							onChange={this.props.fieldChanged}
							name="readNext"
						/>
					</div>
				</div>
			</div>
		);
	}
}