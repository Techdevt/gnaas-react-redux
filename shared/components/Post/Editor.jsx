import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Textfield, Content } from 'react-mdl';
import showdown from 'showdown';

export default class Editor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			width: Math.floor(window.innerWidth / 2)
		};
	}

	componentDidMount() {
		this.setState({
			...this.state
		});
	}

	componentDidUpdate(prevProps, prevState) {
		const { content } = this.props;
		const renderedContainer = ReactDOM.findDOMNode(this.refs['rendered']);
		const converter = new showdown.Converter();
      	renderedContainer.innerHTML = converter.makeHtml(content);
	}

	getHeight = () => {
		const container = document.querySelector('.Editor__Rendered');
		let rows = Math.ceil((window.innerHeight - 99) / 26);
		// if(container) {
		// 	rows = Math.ceil(parseInt(getComputedStyle(container)
		// 				.getPropertyValue('height')
		// 				.replace('px', ""), 10) / 24);
		// }
		
		return rows;
	};

	getWidth = () => {
		return Math.floor(parseInt(getComputedStyle
						(document.querySelector('.EditorContainer'))
						.getPropertyValue('width')
						.replace('px', ""), 10) / 2);
	};

	render() {
		const { width } = this.state;
		const { content, contentChanged, rows } = this.props;
		return (
			<div style={{display: 'flex'}}>
				<Content className="Editor" style={{width: `${width}px`}}>
					<Textfield
					    onChange={ contentChanged.bind(this) }
					    label="Share something..."
					    rows={ rows }
					    value={content}
					    className="Editor__TextField"
					    style={{width: '100%'}}
					/>
				</Content>
				<div className="Editor__Rendered" style={{width: `${width}px`}} ref="rendered">
				</div>
			</div>
		);
	}
}