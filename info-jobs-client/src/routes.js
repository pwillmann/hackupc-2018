import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import CvDropDown from 'pages/CvDropDownPage';
import Analysis from 'pages/AnalysisPage';
import Feedback from 'pages/FeedbackPage';

export const Routes = () => (
  <Switch>
    <Route exact={true} path="/" component={CvDropDown} />
    <Route exact={true} path="/analysis" component={Analysis} />
    <Route exact={true} path="/results" component={Feedback} />
  </Switch>
);
