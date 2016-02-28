import React, {Component, PropTypes} from 'react';
import {Header, Navigation, HeaderRow, Textfield, FABButton, Icon, Grid, Cell, Menu, MenuItem, Button} from 'react-mdl';
import {Link} from 'react-router';
import { connect } from 'react-redux';
import { logoutUser } from 'actions/AuthActions';

@connect(state => ({Auth: state.Auth}))
export default class AppBar extends Component {

    constructor(props) {
        super(props);
    }

    onLogout = (evt) => {
        evt.preventDefault();
        const { dispatch } = this.props;

        dispatch(logoutUser());
    };

	render() {
        const { Auth } = this.props;

		return (
            <Header className="AppBar">
                    <div className="AppBar__logo">
                        <img src="images/martsdirect-logo-sans-serif.png" />
                    </div>

                    <div className="grid AppBar__main">
                        <HeaderRow className="AppBar__main--top">
                            <Navigation className="AppBar__main--top-nav">
                                <div>
                                    {
                                        Auth.get('isAuthenticated') &&
                                        <div>
                                            <span id="demo-menu-lower-right" className='AppBar__menu-item-nav'>Your Account</span>
                                            <Menu target="demo-menu-lower-right" ripple className="mdl-shadow--3dp AppBar__menu-item-dropdown">
                                                <Link to="dashboard" className="mdl-menu__item mdl-js-ripple-effect">Dashboard</Link>
                                                <MenuItem onClick={this.onLogout}>Logout</MenuItem>
                                            </Menu>
                                        </div>
                                    }
                                    {
                                        !Auth.get('isAuthenticated') &&
                                        <div>
                                            <Link to="login" className='AppBar__menu-item-nav'>Your Account</Link>
                                        </div>
                                    }
                                </div>
                                <div>
                                    <Link to="tutorials" className='AppBar__menu-item-nav'>Try Prime</Link>
                                </div>
                                <div>
                                    <Link to="projects" className='AppBar__menu-item-nav'>Wishlist</Link>
                                </div>
                            </Navigation>
                        </HeaderRow>
                        <HeaderRow className="AppBar__main--middle">
                            <div className="AppBar__main--middle-catselect">
                                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select">
                                    <input className="mdl-textfield__input" type="text" id="sample2" value="Cell Phone & Accessories" readOnly tabIndex="-1" />
                                    <label htmlFor="sample2">
                                        <i className="mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>
                                    </label>
                                    <label htmlFor="sample2" className="mdl-textfield__label">search category</label>
                                    <ul htmlFor="sample2" className="mdl-menu mdl-menu--bottom-left mdl-js-menu">
                                        <li className="mdl-menu__item">Cell Phone & Accessories</li>
                                        <li className="mdl-menu__item">Television Sets</li>
                                        <li className="mdl-menu__item">Clothing</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="AppBar__main--middle-search">
                                <Textfield
                                    label="Search something here..."
                                    inputClassName="AppBar__main--middle-search-input"
                                    expandable
                                    expandableIcon="search"
                                />
                            </div>
                        </HeaderRow>
                        <HeaderRow className="AppBar__main--bottom">
                            <Navigation className="AppBar__bottom--nav">
                                <div>
                                    <Link to="about" className='AppBar__menu-item-nav active'>Shop by Department</Link>
                                </div>
                                <div >
                                    <Link to="tutorials" className='AppBar__menu-item-nav'>Your MartsDirect.com</Link>
                                </div>
                                <div >
                                    <Link to="projects" className='AppBar__menu-item-nav'>Today's Deals</Link>
                                </div>
                                <div >
                                    <Link to="contacts" className='AppBar__menu-item-nav'>Gift Cards</Link>
                                </div>
                                <div >
                                    <Link to="sell" className='AppBar__menu-item-nav'>Sell</Link>
                                </div>
                                <div >
                                    <Link to="contacts" className='AppBar__menu-item-nav'>Help</Link>
                                </div>
                            </Navigation>
                        </HeaderRow>
                        <FABButton colored raised ripple className="AppBar__fav">
                            <Icon name="shopping_cart" />
                        </FABButton>
                    </div>
            </Header>
        );
	}
}