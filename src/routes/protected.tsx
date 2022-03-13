import React, { ComponentType, useContext } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

import { useStoreSelector } from "./../hooks";

interface Props extends RouteProps {
  path: string;
  component: ComponentType;
}

export const ProtectedRoute = ({ path, component: Component }: Props) => {
  const { isUserLoggedIn, hasErrored } = useStoreSelector(
    (state) => state.global
  );

  return (
    <Route
      path={path}
      render={() =>
        hasErrored ? (
          <Redirect to="/500" />
        ) : isUserLoggedIn ? (
          <Component />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};
