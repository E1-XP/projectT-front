import React, { useEffect, Suspense, lazy } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { useStoreDispatch } from "../hooks";
import { history } from "./history";

import { Loader } from "./../components/loader";
import { ProtectedRoute } from "./protected";

import { Form } from "../pages/forms";
import { Sidebar } from "../components/sidebar";

const Timer = lazy(() => import("../pages/timer"));
const Reports = lazy(() => import("../pages/reports"));
const Projects = lazy(() => import("../pages/projects"));
const Settings = lazy(() => import("../pages/settings"));

import { initReAuth } from "../actions/global";

export const Routes = () => {
  const dispatch = useStoreDispatch();

  useEffect(() => {
    dispatch(initReAuth());
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <Loader>
        <Route exact={true} path="/" render={() => <Redirect to="/timer" />} />
        <Route path="/login" component={Form} />
        <Route path="/signup" component={Form} />
        <ProtectedRoute path="/" component={Sidebar} />
        <Switch>
          <ProtectedRoute path="/timer" component={Timer} />
          <ProtectedRoute path="/reports" component={Reports} />
          <ProtectedRoute path="/projects" component={Projects} />
          <ProtectedRoute path="/settings" component={Settings} />
          <ProtectedRoute path="*" component={() => <Redirect to="/timer" />} />
        </Switch>
      </Loader>
    </Suspense>
  );
};
