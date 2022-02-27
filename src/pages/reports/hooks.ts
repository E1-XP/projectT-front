import { useEffect, useState, useMemo, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import endOfDay from "date-fns/endOfDay";

export interface Range {
  startDate: Date;
  endDate: Date;
}

const useQuery = () => {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
};

export const useQuerySync = () => {
  const { pathname, search } = useLocation();
  const history = useHistory();
  const query = useQuery();

  const didMount = useRef(false);
  const isFirstMount = () => !didMount.current;

  const [state, setState] = useState({
    startDate: startOfWeek(Date.now(), { weekStartsOn: 1 }),
    endDate: endOfWeek(Date.now(), { weekStartsOn: 1 }),
  });

  const syncRange = (nextS: typeof state) => {
    if (nextS.startDate === nextS.endDate) {
      nextS.endDate = endOfDay(nextS.endDate);
    }

    setState(nextS);
  };

  useEffect(() => {
    const currStartDate = query.get("startDate");
    const currEndDate = query.get("endDate");

    if (isFirstMount()) {
      const nextState = { ...state };

      if (currStartDate && !isNaN(Number(currStartDate))) {
        nextState.startDate = new Date(Number(currStartDate));
      }
      if (currEndDate && !isNaN(Number(currEndDate))) {
        nextState.endDate = new Date(Number(currEndDate));
      }

      setState(nextState);
    }

    history.replace(
      pathname +
        `?startDate=${state.startDate.getTime()}&endDate=${state.endDate.getTime()}`
    );

    if (isFirstMount()) didMount.current = true;
  }, [state]);

  return { range: state, syncRange };
};
