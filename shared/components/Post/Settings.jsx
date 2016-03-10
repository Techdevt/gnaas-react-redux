import React, { PropTypes, Component } from 'react';
import { Textfield, Checkbox } from 'react-mdl';

export default class Settings extends Component {
	render() {
		return (
			<div className="PostSettings">
				<div className="PostSettings__section">
					<h3>Abstract</h3>
					<div className="PostSettings__abstract PostSettings__text">
						<Textfield
							label="post abstract(summary)"
						    rows={5}
						    style={{width: '100%'}}
						/>
					</div>
				</div>
				<div className="PostSettings__section">
					<Checkbox label="Published" ripple checked={ this.props.published } />
				</div>

				<div className="PostSettings__section">
					<h3>Tags</h3>
					<div className="PostSettings__text">
						<Textfield
							label="Tags..."
							style={{width: '100%'}}
							onChange={() => {}}
						/>
					</div>
				</div>

				<div className="PostSettings__section">
					<h3>URL</h3>
					<div className="PostSettings__text">
						<Textfield
							label="url"
							style={{width: '100%'}}
							onChange={() => {}}
						/>
					</div>
				</div>

				<div className="PostSettings__section">
					<h3>Read Next</h3>
					<div className="PostSettings__text">
						<Textfield
							label="read next..."
							style={{width: '100%'}}
							onChange={() => {}}
						/>
					</div>
				</div>
			</div>
		);
	}
}