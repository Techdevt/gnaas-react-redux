import React     from 'react';
import { Route, IndexRoute } from 'react-router';
import App from 'containers/App';
import AppLayout from 'containers/AppLayout';
import AsideLayout from 'components/AsideLayout';
import Home from 'components/Home';
import AboutPage from 'components/AboutPage';
import Login    from 'components/Login';
import Signup   from 'components/Signup';
import Sell   from 'components/Sell';
import DashLayout from 'containers/DashLayout';
import Dashboard from 'components/Dashboard';
import Settings from 'components/Settings';
import requireAuthentication from 'components/AuthenticatedComponent';
import UnauthorizedComponent from 'components/UnauthorizedComponent';
import Profile from 'components/Profile';
import Password from 'components/Password';
import ContactDetails from 'components/ContactDetails';
import Billings from 'components/Billings';
import WishList from 'components/WishList';
import Delegates from 'components/Delegates';
import EditDelegate from 'components/EditDelegate';
import Users  from 'components/Users';
import EditUser from 'components/editUser';
import EditProfile from 'components/EditAccount/Profile';
import EditContactDetails from 'components/EditAccount/EditContactDetails';
 
if(process.env.BROWSER) {
	require('react-mdl/extra/material');
}
  
export default (
  <Route name="app" component={App}>
  	<Route component={AppLayout}> 
  		<Route component={Home} path="/" />
  		<Route component={AsideLayout}>
  			<Route name="about" component={AboutPage} path="/about" />
  		</Route>
  		<Route name="login" component={Login} path="login" />
      <Route name="signup" component={Signup} path="signup" />
      <Route name="sell" component={Sell} path="sell" />
      <Route name="unauthorized" component={UnauthorizedComponent} path="unauthorized" />
  	</Route>
    <Route component={requireAuthentication(DashLayout)} path="dashboard">
      <IndexRoute name="Dashboard" component={Dashboard} />
      <Route name="Settings" component={requireAuthentication(Settings)} path="settings">
          <IndexRoute name="Profile" component={Profile}/>
          <Route name="Password" path="password" component={Password}/>
          <Route name="Contact Details" path="contact-details" component={ContactDetails}/>
          <Route name="Billing" path="billing" component={Billings}/>
          <Route name="Wishlist" path="wishlist" component={WishList}/>
      </Route>
      <Route name="Delegates" component={requireAuthentication(Delegates, 'merchant')} path="delegates" />
      <Route name="Users" component={requireAuthentication(Users, 'admin')} path="users" />
      <Route name="Edit Users" component={EditUser} path="users/edit">
        <Route name="Edit Profile" path="profile" component={EditProfile}/>
        <Route name="Contact Details" path="contact-details" component={EditContactDetails}/>
      </Route>
      <Route name="Edit Delegate" component={EditDelegate} path="delegates/:id" />
    </Route>
  </Route>
);