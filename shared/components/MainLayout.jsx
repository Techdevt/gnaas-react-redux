import React, {Component, PropTypes} from 'react';
import {Layout, Header, Navigation, Drawer, Content} from 'react-mdl';
import {Link} from 'react-router';

import AppBar      from './AppBar';
import Footer        from './Footer';

export default class MainLayout extends Component { 
	toggleDrawer = (e) => {
        document.querySelector('.mdl-layout__drawer').classList.remove('is-visible');
        let dimmer = document.querySelector('.mdl-layout__obfuscator');
        dimmer.classList.remove('is-visible');
    };

	render() {
        return (
            <Layout fixedHeader style={{minHeight: '100%',height:"auto", position: 'relative'}}>
                <AppBar />
                <Drawer onClick={this.toggleDrawer}>
                    <Navigation>
                        <Link to="/" className='MainLayout__drawer-nav-link'>home</Link>
                        <Link to="/about" className='MainLayout__drawer-nav-link'>about us</Link>
                        <Link to="/tutorials" className='MainLayout__drawer-nav-link'>tutorials</Link>
                        <Link to="/projects" className='MainLayout__drawer-nav-link'>projects</Link>
                        <Link to="/contacts" className='MainLayout__drawer-nav-link'>contact</Link>
                    </Navigation>
                </Drawer>

                <div className="">
                    {this.props.children}
                </div>
                <Footer/>
            </Layout>
        );
    }
}