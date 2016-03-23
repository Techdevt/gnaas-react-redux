import React, {Component, PropTypes} from 'react';
import {Layout, Header, Navigation, Drawer, Content, Textfield, IconButton} from 'react-mdl';
import {Link} from 'react-router';
import DashBar from 'components/DashBar';
import User from 'components/DashBarUser';

export default class DashLayout extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

	toggleDrawer = (e) => {
        document.querySelector('.mdl-layout__drawer').classList.remove('is-visible');
        let dimmer = document.querySelector('.mdl-layout__obfuscator');
        dimmer.classList.remove('is-visible');
    };

    componentWillUpdate() {
        const {history} = this.props;
    }

    generateLinks() {
        const { type } = this.props; 
        const navLinks = [
            {to: '/dashboard/settings', name: 'Settings', allow: ['alumni', 'student', 'admin']},
            {to: '/dashboard/users', name: 'Users', allow: ['admin']},
            {to: '/dashboard/posts', name: 'Posts', allow: ['admin']}
        ];
        const links = navLinks.filter(function(link) {
            return link.allow.indexOf(type) !== -1;
        });
        return links;
    }

    goToHome = (evt) => {
        evt.preventDefault();
        const { history } = this.props;
        history.pushState(null, '/');
    };

	render() {
        const { user, type } = this.props;
        const passedAvatar = user.roles[type].avatarUrl[1];
        const fullName = `${user.roles[type].firstName} ${user.roles[type].lastName}`;
        const links = this.generateLinks();

        const currentRoute =  this.props.routes[this.props.routes.length-1];
        return (
            <div style={{minHeight: '100%',height: '100%',position: 'relative'}}>
                <Layout fixedHeader fixedDrawer>
                    <DashBar title={currentRoute.name}/>
                    <Drawer onClick={this.toggleDrawer}>
                        <Header className="Drawer__Header">
                            <User className="Drawer__Header_avatar" passedAvatar={passedAvatar}/>
                            <span className="Drawer__Header_title">{fullName}</span>
                            <IconButton name="home" className="Drawer__Header_home" onClick={this.goToHome}/>
                        </Header>
                        <Navigation>
                            {
                                links.map(function(link, index) {
                                    return(
                                        <Link to={link.to} key={index} activeClassName="active">{link.name}</Link>
                                    );
                                })
                            }
                        </Navigation>
                    </Drawer>

                    <Content className="DashContent">
                        <div>
                            {this.props.children}
                        </div>
                    </Content>
                </Layout>
            </div>
        );
    }
}