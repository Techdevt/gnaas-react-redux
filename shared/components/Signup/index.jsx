import React, { Component, PropTypes } from 'react';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';

const steps = 
    [
      {name: 'Basic Information', component: StepOne},
      {name: 'Credentials', component: StepTwo},
      {name: 'Contact Information', component: StepThree}
    ];

export default steps;