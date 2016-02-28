import React, { Component, PropTypes } from 'react';
//edit step one
import StepOneDel from './StepOneDel';
import StepThree from './StepThree';
//add merchant account payment information step 4
const steps = 
    [
      {name: 'Credentials', component: StepOneDel},
      {name: 'Contact Information', component: StepThree}
    ];

export default steps;