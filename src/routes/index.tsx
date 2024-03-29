import React, { useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { useStoreDispatch } from "../hooks";
import { history } from "./history";

import { Loader } from "./../components/loader";
import { ProtectedRoute } from "./protected";

import { Form } from "../pages/forms";
import { Sidebar } from "../components/sidebar";

import Timer from "../pages/timer";
import Reports from "../pages/reports";
import Projects from "../pages/projects";
import Settings from "../pages/settings";
import ErrorPage from "./../pages/error";

import { initReAuth } from "../actions/global";

export const Routes = () => {
  const dispatch = useStoreDispatch();

  useEffect(() => {
    dispatch(initReAuth());
  }, []);

  return (
    <Loader>
      <Route exact={true} path="/" render={() => <Redirect to="/timer" />} />
      <Route path="/login" component={Form} />
      <Route path="/signup" component={Form} />
      <Route path="/500" component={ErrorPage} />
      <ProtectedRoute path="/" component={Sidebar} />
      <Switch>
        <ProtectedRoute path="/timer" component={Timer} />
        <ProtectedRoute path="/reports" component={Reports} />
        <ProtectedRoute path="/projects" component={Projects} />
        <ProtectedRoute path="/settings" component={Settings} />
        <ProtectedRoute path="*" component={() => <Redirect to="/timer" />} />
      </Switch>
    </Loader>
  );
};
