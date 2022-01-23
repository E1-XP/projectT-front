import { setIsFetching } from "../actions/global";
import { store } from "../store";

export const request = function (path: RequestInfo, options: RequestInit) {
  store.dispatch(setIsFetching(true));

  return fetch(path, options).then((data) => {
    setTimeout(() => store.dispatch(setIsFetching(false)), 250);
    return data;
  });
};
