import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import intervalToDuration from "date-fns/intervalToDuration";
import { configureStore } from "@reduxjs/toolkit";

import { createRootReducer } from "../../../reducers";
import { history } from "../../../routes/history";

import entries from "./../../__MOCKS__/entries.json";

import { batchInsertEntry } from "../../../actions/entry";
import { formatDuration } from "../../../helpers";

import {
  calcTotalDuration,
  getThisWeekEntries,
  WeekCounter,
} from "../../../pages/timer/weekCounter";
import { groupEntriesByDays } from "../../../selectors/groupEntriesByDays";

describe("test weekCounter", () => {
  const storeMock = configureStore({
    reducer: createRootReducer(history),
  });

  storeMock.dispatch(batchInsertEntry(entries));

  it("shows on screen", () => {
    const { getByText } = render(
      <Provider store={storeMock}>
        <WeekCounter />
      </Provider>
    );

    expect(getByText("This week:")).toBeInTheDocument();
  });

  it("has access to entries from store and calculates them", () => {
    const { getByText } = render(
      <Provider store={storeMock}>
        <WeekCounter />
      </Provider>
    );

    const { timer } = storeMock.getState();

    const totalDuration = calcTotalDuration(
      getThisWeekEntries(groupEntriesByDays(storeMock.getState())),
      timer.duration
    );

    const durationText = formatDuration(
      intervalToDuration({ start: 0, end: totalDuration })
    );

    expect(getByText(durationText)).toBeInTheDocument();
  });
});
