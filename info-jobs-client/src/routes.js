import * as React from "react";
import { Route, Switch } from "react-router-dom";
import CSVDropDown from "pages/CSVDropDown";

export const Routes = () => (
  <Switch>
    <Route exact={true} path="/" component={CSVDropDown} />
  </Switch>
);
