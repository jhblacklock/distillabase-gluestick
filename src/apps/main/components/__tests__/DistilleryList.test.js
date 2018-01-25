import React from "react";
import { shallow } from "enzyme";

import DistilleryList from "apps/main/components/DistilleryList";

describe("apps/main/components/DistilleryList", () => {
  it("renders without an issue", () => {
    const subject = <DistilleryList />;
    const wrapper = shallow(subject);
    expect(wrapper).toBeDefined();
  });
});
