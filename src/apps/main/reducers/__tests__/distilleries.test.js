/* @flow */

import reducer from "apps/main/reducers/distilleries";

describe("apps/main/reducers/distilleries", () => {
  it("returns the initial state", () => {
    const state = {};
    expect(
      reducer(
        {},
        {
          type: "_TEST_ACTION",
        },
      ),
    ).toEqual(state);
  });
});
