/* @flow */
import { createSelector } from "reselect";
import Immutable from "seamless-immutable";
import isEqual from "lodash/isEqual";

// Reducer
export default function apiMemoization(
  state: any = Immutable({}),
  action: Object,
) {
  const { type, meta: { apiArgs, apiActionType } = {} } = action;

  if (!apiActionType) {
    return Immutable.isImmutable(state) ? state : Immutable(state);
  }

  switch (type) {
    case `${apiActionType}_INIT`:
      return state.set(apiActionType, {
        isLoading: true,
        error: null,
        apiArgs: null,
      });

    case apiActionType:
      return state.set(apiActionType, {
        isLoading: false,
        error: null,
        apiArgs,
      });

    case `${apiActionType}_FAILURE`:
      return state.set(apiActionType, {
        isLoading: false,
        error: action.error.statusText || action.error.code,
        apiArgs,
      });

    default:
      return Immutable.isImmutable(state) ? state : Immutable(state);
  }
}

// Selectors
export const getApiError = (state: any, actionType: string) => {
  const status = state[actionType] || {};
  return status.error;
};

export const getIsAllLoadedFactory = (actionTypes: Array<string>) =>
  createSelector(
    state => state,
    state => {
      return actionTypes.every(actionType => {
        const slice = state[actionType];
        if (!slice) {
          return false;
        }
        const result = !slice.isLoading && slice.apiArgs !== null;
        return result;
      });
    },
  );

export const getIsAnyLoadingFactory = (actionTypes: Array<string>) =>
  createSelector(
    state => state,
    state => {
      return actionTypes.some(actionType => {
        const slice = state[actionType];
        return slice && slice.isLoading;
      });
    },
  );

/**
 * Return a "memoized" version of a promise action creator.
 * The memoized version will not dispatch the action if:
 *   - the promise has not resolved (e.g. api request is still loading)
 *   - the action has already been dispatched with the same arguments
 *
 * The memoized action creator can be called multiple times (e.g. in componentDidUpdate)
 * and it will do nothing unless the arguments change.
 *
 * Assume original action creator returns a simple
 * action object (i.e. it is not a thunk action creator).
 * Used with the request reducer above and gluestick's promise middleware.
 *
 * NOTE: "memoized" is in quotes because this does not manage storing the cached data.
 * It only manages whether to dispatch the action or not. Assume the user has stored
 * the data in Redux.
 *
 * IMPORTANT: each action creator must return an action object with a different type
 * because the type is used as the memoization key.
 *
 * Usage:
 *   const fetchSomething = memoize(_fetchSomething);
 * or
 *   const fetchSomething = memoize(_fetchSomething, {cacheErrors: false});
 */
export function memoize(actionCreator: Function, options: Object = {}) {
  // store the promise returned by dispatching the action so it can be returned if
  // loading or cached.
  let result;
  const { cacheErrors = false } = options;

  return (...args: Array<*>) => {
    return (dispatch: Function, getState: Function) => {
      const isDev = process.env.NODE_ENV !== "production";
      const state = getState();
      const action = actionCreator(...args);

      if (!action) {
        return Promise.resolve();
      }

      const { isLoading, error, apiArgs: prevArgs } =
        state.apiMemoization[action.type] || {};
      // skip the cache if there is an error and the `cacheErrors` option is false
      const skipCache = !!error && !cacheErrors;

      if (isLoading) {
        // DON'T FETCH if already loading
        isDev &&
          console.log(`apiMemoization.js [loading] ${action.type}`, args); // eslint-disable-line
        return result;
      }
      if (isEqual(args, prevArgs)) {
        if (skipCache) {
          // FETCH if the cache should be skipped (see above)
          isDev &&
            // eslint-disable-next-line
            console.log(
              `apiMemoization.js [skipping cache] ${action.type}`,
              args,
            );
          // don't return here
        } else {
          // DON'T FETCH if there is cached data
          isDev &&
            console.log(`apiMemoization.js [cached] ${action.type}`, args); // eslint-disable-line
          return result;
        }
      } else {
        // FETCH if it is the first request or arguments changed
        isDev &&
          console.log(`apiMemoization.js [requesting] ${action.type}`, args); // eslint-disable-line
        // don't return here
      }

      // add "apiArgs" and "apiActionType" to the original action, dispatch the action,
      // and store the promise in result to return in "cached" or "loading" scenarios.
      result = dispatch({
        ...action,
        meta: {
          ...action.meta,
          apiArgs: args,
          apiActionType: action.type,
        },
      });

      return result;
    };
  };
}
