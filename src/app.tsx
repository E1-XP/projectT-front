import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";

import { Head } from "./head";
import { Routes } from "./routes";
import { history } from "./routes/history";
import { useStoreSelector } from "./hooks";
import { store } from "./store";
import { GlobalStyle } from "./styles";

export const App = () => {
  const isUserLoggedIn = useStoreSelector(
    (state) => state.global.isUserLoggedIn
  );

  return (
    <>
      <Head />
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <GlobalStyle isSidebarVisible={isUserLoggedIn} />
          <Routes />
        </ConnectedRouter>
      </Provider>
    </>
  );
};
