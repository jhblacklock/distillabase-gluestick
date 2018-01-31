/* @flow */
import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import * as apiSelectors from "main/reducers/apiMemoization";
import { fetchDistillery } from "main/actions/distillery";
import type { Distillery } from "main/types";
import type { FetchDistilleryAction } from "main/actions/distillery";
import DistilleryDetails from "main/components/DistilleryDetails";

type Props = {
  distillery: Distillery,
  actions: {
    fetchDistillery: FetchDistilleryAction,
  },
  isLoading: boolean,
};

export class DistilleryApp extends React.PureComponent {
  props: Props;

  static async gsBeforeRoute({ dispatch }) {
    return dispatch(fetchDistillery());
  }

  render() {
    return (
      <div>
        <Helmet title="DistlleryApp" />
        <DistilleryDetails />
      </div>
    );
  }
}

export default connect(
  state => ({
    isLoading: apiSelectors.getIsAnyLoadingFactory(["FETCH_DISTILLERY"])(
      state.apiMemoization,
    ),
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        fetchDistillery,
      },
      dispatch,
    ),
  }),
)(DistilleryApp);
