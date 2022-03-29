import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";

import { Head } from "./head";
import { Routes } from "./routes";
import { history } from "./routes/history";
import { RootState, store } from "./store";
import { GlobalStyle } from "./styles";

export const App = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    store.getState().global.isUserLoggedIn
  );

  useEffect(() => {
    const unsub = store.subscribe(() =>
      setIsUserLoggedIn(store.getState().global.isUserLoggedIn)
    );

    return () => unsub();
  }, []);

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
