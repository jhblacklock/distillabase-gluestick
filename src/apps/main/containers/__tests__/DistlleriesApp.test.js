/* @flow */
import React from "react";
import { shallow } from "enzyme";
import { DistlleriesApp } from "apps/main/containers/DistlleriesApp";

describe("apps/main/containers/DistlleriesApp", () => {
  it("renders without an issue", () => {
    const subject = <DistlleriesApp />;
    const wrapper = shallow(subject);
    expect(wrapper).toBeDefined();
  });
});
