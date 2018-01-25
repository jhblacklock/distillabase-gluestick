import React from "react";
import { shallow } from "enzyme";
import DistilleryDetails from "apps/main/components/DistilleryDetails";

describe("apps/main/components/DistilleryDetails", () => {
  it("renders without an issue", () => {
    const subject = <DistilleryDetails />;
    const wrapper = shallow(subject);
    expect(wrapper).toBeDefined();
  });
});
