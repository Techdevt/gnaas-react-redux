import React, { Component, PropTypes } from 'react';
//edit step one
import StepOne from './StepOneAlumni';
import StepOneBasic from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
//add merchant account payment information step 4
const steps = 
    [
      {name: 'Basic Information', component: StepOne},
      {name: 'Credentials', component: StepTwo},
      {name: 'Contact Information', component: StepThree}
    ];

export default steps;