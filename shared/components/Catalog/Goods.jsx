import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { FABButton, Icon } from 'react-mdl';
import MAddItem from 'components/Catalog/MAddItem';
import Portal from 'react-portal';

export default class Goods extends Component {
	animateEnter = (DOMNode) => {
		const TWEEN = require('tween.js');
		const node = DOMNode.children[0];
		new TWEEN.Tween({ top: 0, left: 0 })
	      .to({ top: 100, left: 100 }, 1000)
	      .easing(TWEEN.Easing.Cubic.In)
	      .onUpdate(function() {
	        node.style.top = this.top + 'px';
        	node.style.left = this.left + 'px';
	      }).start();

	    requestAnimationFrame(animate);
		 
		function animate(time) {
			requestAnimationFrame(animate);
			TWEEN.update(time);
		}
	};

	beforeClose = (DOMNode, removeFromDOM) => {
		const TWEEN = require('tween.js');
		var tween = new TWEEN.Tween({opacity: 1})
			.to({opacity: 0}, 500)
			.onUpdate(function() {
				DOMNode.style.opacity = this.opacity;
			})
			.start()
			.onComplete(function() {
				removeFromDOM();
			});
 
		requestAnimationFrame(animate);
		 
		function animate(time) {
			requestAnimationFrame(animate);
			TWEEN.update(time);
		}
	};

	render() {
		const FAB = <FABButton colored raised className="Goods__add">
						<Icon name="add"/>
					</FABButton>;
		return (
			<div className="Goods">
				<h3>Goods</h3>
				<Portal closeOnEsc openByClickOn={FAB} onOpen={this.animateEnter} beforeClose={this.beforeClose}>
			        <MAddItem>
			          <h2>Pseudo Modal</h2>
			          <p>This react component is appended to the document body.</p>
			        </MAddItem>
			     </Portal>
			</div>
		);
	}
}