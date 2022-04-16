import React, { ComponentType, useContext } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

import { useStoreSelector } from "./../hooks";

interface Props extends RouteProps {
  path: string;
  component: ComponentType;
}

export const ProtectedRoute = ({ path, component: Component }: Props) => {
  const { isUserLoggedIn, errorFlag } = useStoreSelector(
    (state) => state.global
  );

  if (errorFlag) return <Redirect to="/500" />;
  if (!isUserLoggedIn) return <Redirect to="/login" />;

  return <Route path={path} component={Component} />;
};
