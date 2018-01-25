/* @flow */

import React from "react";
import { shallow } from "enzyme";

import { DistilleryApp } from "apps/main/containers/DistilleryApp";

describe("apps/main/containers/DistilleryApp", () => {
  it("renders without an issue", () => {
    const subject = <DistilleryApp />;
    const wrapper = shallow(subject);
    expect(wrapper).toBeDefined();
  });
});
