 import React, { Component, PropTypes } from 'react';
 import MainLayout from 'components/MainLayout';

export default class AppLayout extends React.Component {
  render() {
  	//this is where basic structure shud live
    return (
	    <MainLayout
	        showFooter={true} style={{height: '100%'}}>
	        {this.props.children}
	    </MainLayout>
    );
  }
}    