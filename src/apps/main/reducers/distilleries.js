/* @flow */
import Immutable from "seamless-immutable";
import type { ImmutableObject } from "seamless-immutable";
import type { Distillery } from "main/types";

export type State = Distillery[];

export const INITIAL_STATE = Immutable([]);

export default (
  state: ImmutableObject<State> = INITIAL_STATE,
  action: Object,
) => {
  switch (action.type) {
    case "FETCH_DISTILLERIES":
      return Immutable([...action.payload.data]);
    default:
      return Immutable.isImmutable(state) ? state : Immutable(state);
  }
};
