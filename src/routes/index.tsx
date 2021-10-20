import React, { useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { useStoreDispatch } from "../hooks";
import { history } from "./history";

import { Loader } from "./../components/loader";
import { ProtectedRoute } from "./protected";
import { Dashboard } from "../pages/dashboard";
import { Form } from "../pages/forms";
import { Sidebar } from "../components/sidebar";

import { setIsLoading } from "../actions/global";

export const Routes = () => {
  const dispatch = useStoreDispatch();

  useEffect(() => {
    dispatch(setIsLoading(false));
  }, []);

  return (
    <Loader>
      <Route exact={true} path="/" render={() => <Redirect to="/timer" />} />
      <Route path="/login" component={Form} />
      <Route path="/signup" component={Form} />
      <ProtectedRoute path="/" component={Sidebar} />
      <Switch>
        <ProtectedRoute path="/dashboard" component={Dashboard} />
      </Switch>
    </Loader>
  );
};
