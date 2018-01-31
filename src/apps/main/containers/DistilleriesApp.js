/* @flow */
import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import { fetchDistilleries } from "main/actions/distilleries";
import type { FetchDistilleriesAction } from "main/actions/distilleries";
import DistilleryList from "main/components/DistilleryList";

type Props = {
  actions: {
    fetchDistilleries: FetchDistilleriesAction,
  },
  isLoading: boolean,
};

export class DistilleriesApp extends React.PureComponent {
  props: Props;

  static gsBeforeRoute({ dispatch }) {
    return dispatch(fetchDistilleries());
  }

  render() {
    return (
      <div>
        <Helmet title="Distilleries" />
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
