/* @flow */
import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import fetchDistilleries from "main/actions/distilleries";
import type { Distillery } from "main/types";
import type { FetchDistilleriesAction } from "main/actions/distilleries";
import DistilleryList from "main/components/DistilleryList";

type Props = {
  distilleries: Distillery[],
  actions: {
    fetchDistilleries: FetchDistilleriesAction,
  },
  isLoading: boolean,
};

export class DistilleriesApp extends React.PureComponent {
  props: Props;

  static async gsBeforeRoute({ dispatch }) {
    dispatch(fetchDistilleries());
  }

  render() {
    return (
      <div>
        <Helmet title="DistilleriesApp" />
        <DistilleryList />
      </div>
    );
  }
}

export default connect(dispatch => ({
  actions: bindActionCreators(
    {
      fetchDistilleries,
    },
    dispatch,
  ),
}))(DistilleriesApp);
