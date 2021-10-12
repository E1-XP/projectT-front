import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";

import { Routes } from "./routes";
import { history } from "./routes/history";
import { store } from "./store";

export const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Routes />
    </ConnectedRouter>
  </Provider>
);
