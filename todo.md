production remove mongodb indexing

martsdirect.com
shopsorder.com

orderdirect.com
directshop.com
directbuy.com

adminPermissions({
	adminAccounts
	userAccounts
});

//finish user module frontend
    + your account link should take you to login screen if not logged in and to dashboard if logged in
//login page
//signup page user
//signup page merchant account
//make signup and login work
//setup sidenav adding collapsed components for header
//setup dashboard
//setup googleanalytics
//test route edituser with file
//proof test delete user

//rerunning npm install lets commit a change
modules
+ user
+ products && wishlisting
+ payment
+ shipment
+ shopping cart module
+ messaging module
+ reporting

ADMIN_STORE = {
    users: [
        admins,
        delegates, 
        merchantssss,
        shoppers
    ],
    user
}

MERCHANT_STORE = {
    DELEGATES,
    USER
};

SHOPPER_STORE = {
    USER
};

DELEGATE_STORE = {
    MERCHANT,
    USER
};

frankowusuansah40@gmail.com
frankowusu

admin user management page //other admins, merchants, delgates, shoppers
admin edit shopper
admin view/change shopper password
admin edit merchant + password
admin edit delegates
admin change own account
admin change user password
fix merchant delegate edit since cancelled autopopulate
admin settings
admin category management
delegate settings
delegate permission manager
merchant billing
logout from dashboard
fix nested routes active state
dashboard redesign
admin create other admins

finish styling delegates page
account history and logs
select user fields returned
set proptypes for authenticated components
error logger mechanism
login failed message show
step three, set required inputs
change font color for settings editing and style the page a bit
store gravatar
remove home icon and add breadcrumbs
error result
reset logged in merchant object session after delegate creation
ActionResult or ActionErrorResult clears message every time
delegate list filter and search and responsivity
allow merchant to edit delegate password on backend
delegate creation refresh merchant

frontpage shows shops in 3d view with moving animation inside
searching for an item brings the shops which has that..user visits the shop he wants
animation is triggered which opens the shop and lets the user in
the wideness of the shop is determined by the number of items the shop has enlisted


disqus unilynq
mailchimp
facebook app name and id
social network links

vitamin c 
blood tonic
Styling the Detail View



Describe the method used by intruders to get access to information by the use of phishing
State three methods of social engineering and explain how they can be used


Data Communication & Networking
Behiouz A. Forouzan
Ch 1-3 && Ch 12
Mon Class Time: Monday 12-2pm
Learn the OSI model through and through


{React.Children.map(this.props.children, (child, tabId) => {
    return React.cloneElement(child, {
        cssPrefix,
        tabId,
        active: tabId === activeTab,
        onTabClick: this._handleClickTab
    });
})}