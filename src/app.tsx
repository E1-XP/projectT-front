import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";

import { Head } from "./head";
import { Routes } from "./routes";
import { history } from "./routes/history";
import { GlobalStyle } from "./styles";
import { store } from "./store";

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
