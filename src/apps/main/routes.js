/* @flow */

import React from "react";
import { Route, IndexRoute } from "react-router";
import { ROUTE_NAME_404_NOT_FOUND } from "compiled/gluestick";

import MasterLayout from "./components/MasterLayout";
import HomeApp from "./containers/HomeApp";
import NoMatchApp from "./containers/NoMatchApp";
import DistilleriesApp from "./containers/DistilleriesApp";
import DistilleryApp from "./containers/DistilleryApp";

export default function routes() {
  return (
    <Route name="app" component={MasterLayout} path="/">
      <IndexRoute name="home" component={HomeApp} />
      <Route path="distilleries">
        <IndexRoute component={DistilleriesApp} />
        <Route path=":distilleryId">
          <IndexRoute component={DistilleryApp} />
        </Route>
      </Route>
      <Route name={ROUTE_NAME_404_NOT_FOUND} path="*" component={NoMatchApp} />
    </Route>
  );
}
