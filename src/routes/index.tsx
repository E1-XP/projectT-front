import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { history } from "./history";

import { ProtectedRoute } from "./protected";
import { Dashboard } from "../pages/dashboard";
import { Form } from "../pages/form";

export const Routes = () => (
  <Switch>
    <Route exact={true} path="/" render={() => <Redirect to="/dashboard" />} />
    <Route path="/login" component={Form} />
    <Route path="/signup" component={Form} />
    <ProtectedRoute path="/dashboard" component={Dashboard} />
  </Switch>
);
