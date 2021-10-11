import { connectRouter } from "connected-react-router";
import { History } from "history";

import { globalReducer } from "./global";

export const createRootReducer = (history: History<unknown>) => ({
  router: connectRouter(history),
  global: globalReducer,
});
