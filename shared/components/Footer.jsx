import React, { Component, PropTypes } from 'react';
import {Footer, FooterSection, FooterLinkList} from 'react-mdl';

export default class footer extends Component {
	render() {
        return (
		    <Footer size="mini">
			    <FooterSection type="left" logo="MartsDirect®" className="grid">
			        <FooterLinkList>
			            <a href="#">Privacy & Terms</a>
			        </FooterLinkList>
			    </FooterSection>
			</Footer>
        );
    }
}