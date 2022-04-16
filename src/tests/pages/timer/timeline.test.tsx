import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import { createRootReducer } from "../../../reducers";
import { history } from "../../../routes/history";

import entries from "./../../__MOCKS__/entries.json";

import { batchInsertEntry } from "../../../actions/entry";

import { groupEntriesByDays } from "../../../selectors/groupEntriesByDays";
import Timeline from "../../../pages/timer/timeline";

describe("test Timeline component", () => {
  const storeMock = configureStore({
    reducer: createRootReducer(history),
  });

  storeMock.dispatch(batchInsertEntry(entries));

  it("displays ten days of grouped entries", () => {
    const { container } = render(
      <Provider store={storeMock}>
        <Timeline />
      </Provider>
    );

    const classNameOpening = "timeline__Timeline_Item";

    expect(
      container.querySelectorAll(`[class^="${classNameOpening}"]`).length
    ).toEqual(10);
  });
});
