import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { history } from "./history";

import { ProtectedRoute } from "./protected";
import { Timer } from "./../pages/timer";
import { Dashboard } from "../pages/dashboard";
import { Form } from "../pages/forms";
import { Sidebar } from "../components/sidebar";

export const Routes = () => (
  <>
    <Route exact={true} path="/" render={() => <Redirect to="/dashboard" />} />
    <Route path="/login" component={Form} />
    <Route path="/signup" component={Form} />
    <ProtectedRoute path="/" component={Sidebar} />
    <Switch>
      <ProtectedRoute path="/timer" component={Timer} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
    </Switch>
  </>
);
