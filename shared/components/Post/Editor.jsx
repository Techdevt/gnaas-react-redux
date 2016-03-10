import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Textfield, Content } from 'react-mdl';
import showdown from 'showdown';

export default class Editor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rows: 10,
			width: Math.floor(window.innerWidth / 2)
		};
	}

	componentDidMount() {
		const rows = this.getRows();
		const width = this.getWidth();
		this.setState({
			...this.state,
			rows: rows,
			width: width
		});
		window.addEventListener('resize', this.reCalculate);
	}

	componentDidUpdate() {
		const { markup } = this.props;
		const renderedContainer = ReactDOM.findDOMNode(this.refs['rendered']);
		const converter = new showdown.Converter();
      	renderedContainer.innerHTML = converter.makeHtml(markup);
	}

	reCalculate = () => {
		this.setState({
			rows: this.getRows(),
			width: this.getWidth()
		});
	};

	getRows = () => {
		return Math.floor((parseInt(getComputedStyle
						(document.querySelector('.EditorContainer'))
						.getPropertyValue('height')
						.replace('px', ""), 10) - 35 ) / 26);
	};

	getWidth = () => {
		return Math.floor(parseInt(getComputedStyle
						(document.querySelector('.EditorContainer'))
						.getPropertyValue('width')
						.replace('px', ""), 10) / 2);	
	};

	render() {
		const { rows, width } = this.state;
		const { markup, markupChanged } = this.props;

		return (
			<div style={{display: 'flex'}}>
				<Content className="Editor" style={{width: `${width}px`}}>
					<Textfield
					    onChange={ markupChanged.bind(this) }
					    label="Share something..."
					    rows={rows}
					    value={markup}
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