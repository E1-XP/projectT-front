import { connectRouter } from "connected-react-router";
import { History } from "history";

import { globalReducer } from "./global";
import { timerReducer } from "./timer";
import { userReducer } from "./user";

export const createRootReducer = (history: History<unknown>) => ({
  router: connectRouter(history),
  global: globalReducer,
  user: userReducer,
  timer: timerReducer,
});
