import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import { createRootReducer } from "../../../reducers";
import { history } from "../../../routes/history";

import entries from "./../../__MOCKS__/entries.json";

import { batchInsertEntry } from "../../../actions/entry";

import { Entry } from "../../../pages/timer/entry";

describe("test Entry component", () => {
  const storeMock = configureStore({
    reducer: createRootReducer(history),
  });

  storeMock.dispatch(batchInsertEntry(entries));

  it("displays single entry values", () => {
    const { getByDisplayValue } = render(
      <Provider store={storeMock}>
        <Entry data={entries[0]} />
      </Provider>
    );

    expect(getByDisplayValue(entries[0].description)).toBeInTheDocument();
  });
});
