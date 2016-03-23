import React, {Component, PropTypes} from 'react';
import {Layout, Header, Navigation, Drawer, Content, IconButton} from 'react-mdl';
import {Card, CardTitle, CardText, CardActions} from 'react-mdl/lib/Card';
import Button      from 'react-mdl/lib/Button';
import Icon      from 'react-mdl/lib/Icon';
import Grid, {Cell} from 'react-mdl/lib/Grid';
import {Link} from 'react-router';

export default class AsideLayout extends Component {

    render() {
        return (
            <div className="about">
                    <Cell
                        col={4}
                        phone={12} 
                        className="sidenav">
                        <nav className="main-nav">
                            <ul>
                                <Link to="about/history">History</Link>
                                <Link to="about/aims">Aims</Link>
                                <Link to="about/operations">Operations</Link>
                                <Link to="about/executives">Executives</Link>
                                <Link to="about/nec">NEC</Link>
                                <Link to="about/structure">Structure</Link>
                                <Link to="about/theme">Theme</Link>
                                <Link to="about/congress">Congress</Link>
                            </ul>
                        </nav>
                    </Cell>
                    <Cell
                        col={8}
                        phone={12}
                        className="about-main">
                        <IconButton name="keyboard_backspace" onClick={this.openNav} className="drawer-about" />
                        {this.props.children}
                    </Cell>
                

            </div>
        );
    }
}
