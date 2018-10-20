import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import CvDropDown from 'pages/CvDropDownPage';
import Analysis from 'pages/AnalysisPage';

export const Routes = () => (
  <Switch>
    <Route exact={true} path="/" component={CvDropDown} />
    <Route exact={true} path="/analysis" component={Analysis} />
  </Switch>
);
