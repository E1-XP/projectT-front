import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";

import { Head } from "./head";
import { Routes } from "./routes";
import { history } from "./routes/history";
import { store } from "./store";
import { GlobalStyle } from "./styles";

export const App = () => (
  <>
    <Head />
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <GlobalStyle />
        <Routes />
      </ConnectedRouter>
    </Provider>
  </>
);
