import React     from 'react';
import { Route, IndexRoute } from 'react-router';
import App from 'containers/App';
import AppLayout from 'containers/AppLayout';
import AboutLayout from 'components/AboutLayout';
import Home from 'components/Home';
import AboutPage from 'components/AboutPage';
import Login    from 'components/Login';
import Signup   from 'components/Signup';
import Alumni   from 'components/Alumni';
import DashLayout from 'containers/DashLayout';
import Dashboard from 'components/Dashboard';
import Settings from 'components/Settings';
import requireAuthentication from 'components/AuthenticatedComponent';
import UnauthorizedComponent from 'components/UnauthorizedComponent';
import Profile from 'components/Profile';
import ContactDetails from 'components/ContactDetails';
import Users  from 'components/Users';
import EditUser from 'components/EditUser';
import EditProfile from 'components/EditAccount/Profile';
import EditContactDetails from 'components/EditAccount/EditContactDetails';
import Post from 'components/Post';
import Posts from 'components/Posts';
import Editor from 'components/Post/Editor';
import PostSettings from 'components/Post/Settings';
import PostImages from 'components/Post/Images';

if(process.env.BROWSER) {
	require('react-mdl/extra/material');
}

export default (
  <Route name="app" component={App}>
  	<Route component={AppLayout}> 
  		<Route component={Home} path="/" />
  		<Route component={AboutLayout}>
  			<Route name="about" component={AboutPage} path="/about" />
  		</Route>
  		<Route name="Login" component={Login} path="login" />
      <Route name="Signup" component={Signup} path="signup" />
      <Route name="Alumni" component={Alumni} path="alumni" />
      <Route name="unauthorized" component={UnauthorizedComponent} path="unauthorized" />
  	</Route>
    <Route component={requireAuthentication(DashLayout)} path="dashboard">
      <IndexRoute name="Dashboard" component={Dashboard} />
      <Route name="Settings" component={requireAuthentication(Settings)} path="settings">
          <IndexRoute name="Profile" component={Profile}/>
          <Route name="Contact Details" path="contact-details" component={ContactDetails}/>
      </Route>
      <Route name="Users" component={requireAuthentication(Users, 'admin')} path="users" />
      <Route name="Edit Users" component={EditUser} path="users/edit">
        <Route name="Edit Profile" path="profile" component={EditProfile}/>
        <Route name="Contact Details" path="contact-details" component={EditContactDetails}/>
      </Route>
      <Route name="Posts" path="posts">
        <IndexRoute name="Post Settings" component={requireAuthentication(Posts, 'admin')}/>
      </Route>
      <Route name="Post" component={requireAuthentication(Post, 'admin')} path="post">
          <IndexRoute name="Editor" component={Editor}/>
          <Route name="Post Settings" component={PostSettings} path="settings"/>
          <Route name="Attach Images" component={PostImages} path="images"/>
      </Route>
    </Route>
  </Route>
);
