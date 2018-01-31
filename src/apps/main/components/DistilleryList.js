/* @flow */
import React from "react";
import { connect } from "react-redux";
import * as apiSelectors from "main/reducers/apiMemoization";
import { pure } from "recompose";
import type { Distillery } from "main/types";

type Props = {
  distilleries: Distillery[],
  isLoading: boolean,
};

class DistilleryList extends React.PureComponent {
  props: Props;
  render() {
    const { distilleries, isLoading } = this.props;

    if (isLoading) {
      return null;
    }
    return (
      <div>
        {distilleries.map((distillery, index) => (
          <DistilleryRow key={index} distillery={distillery} />
        ))}
      </div>
    );
  }
}

type DistilleryRowProps = {
  distillery: Distillery,
};

const _DistilleryRow = ({ distillery }: DistilleryRowProps) => {
  return <div>{distillery.name}</div>;
};

const DistilleryRow = pure(_DistilleryRow);

export default connect(state => ({
  distilleries: state.distilleries,
  isLoading: apiSelectors.getIsAnyLoadingFactory(["FETCH_DISTILLERIES"])(
    state.apiMemoization,
  ),
}))(DistilleryList);
