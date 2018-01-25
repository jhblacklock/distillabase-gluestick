/* @flow */
import React from "react";
import { connect } from "react-redux";
import * as apiSelectors from "main/reducers/apiMemoization";
import type { Distillery } from "main/types";

type Props = {
  distillery: Distillery,
  isLoading: boolean,
};

class DistilleryDetails extends React.PureComponent {
  props: Props;
  render() {
    const { distillery } = this.props;

    return <div>{distillery.name}</div>;
  }
}

export default connect(state => ({
  distillery: state.distillery,
  isLoading: apiSelectors.getIsAnyLoadingFactory(["FETCH_DISTILLERY"])(
    state.apiMemoization,
  ),
}))(DistilleryDetails);
