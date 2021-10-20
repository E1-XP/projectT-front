import React, { ComponentType, useContext } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

import { useStoreSelector } from "./../hooks";

interface Props extends RouteProps {
  path: string;
  component: ComponentType;
}

export const ProtectedRoute = ({ path, component: Component }: Props) => {
  const isUserLoggedIn = useStoreSelector(
    (state) => state.global.isUserLoggedIn
  );

  return (
    <Route
      path={path}
      render={() => (isUserLoggedIn ? <Component /> : <Redirect to="/login" />)}
    />
  );
};
