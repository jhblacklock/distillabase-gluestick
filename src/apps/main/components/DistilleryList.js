/* @flow */
import React from "react";
import { connect } from "react-redux";
import * as apiSelectors from "main/reducers/apiMemoization";
import { pure } from "reselect";
import type { Distillery } from "main/types";

type Props = {
  distilleries: Distillery[],
  isLoading: boolean,
};

class DistilleryList extends React.PureComponent {
  props: Props;
  render() {
    const { distilleries } = this.props;

    return (
      <div>{distilleries.map(distillery => DistilleryRow(distillery))}</div>
    );
  }
}

const _DistilleryRow = ({ distillery }: Distillery) => {
  return <div>{distillery.name}</div>;
};
const DistilleryRow = pure(_DistilleryRow);

export default connect(state => ({
  distilleries: state.distilleries,
  isLoading: apiSelectors.getIsAnyLoadingFactory(["FETCH_DISTILLERIES"])(
    state.apiMemoization,
  ),
}))(DistilleryList);
