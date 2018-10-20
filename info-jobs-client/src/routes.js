import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import CvDropDown from 'pages/CvDropDownPage';

export const Routes = () => (
  <Switch>
    <Route exact={true} path="/" component={CvDropDown} />
  </Switch>
);
