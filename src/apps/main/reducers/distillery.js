/* @flow */
import Immutable from "seamless-immutable";
import type { ImmutableObject } from "seamless-immutable";
import type { Distillery } from "main/types";

export type State = Distillery;

export default (state: ImmutableObject<State> = {}, action: Object) => {
  switch (action.type) {
    case "FETCH_DISTILLERY":
      return state.set(action.payload.data);
    default:
      return Immutable.isImmutable(state) ? state : Immutable(state);
  }
};
