/*global describe it*/
/*global expect*/
import { createStore } from "compiled/gluestick";
import Immutable from "seamless-immutable";

import reducer, { getIsAllLoadedFactory, memoize } from "../apiMemoization";

describe("reducers/apiMemoization", () => {
  describe("apiMemoization reducer", () => {
    it("returns the initial state", () => {
      const action = {};
      const state = void 0;
      const actual = reducer(state, action);
      const expected = {};
      expect(actual).toEqual(expected);
    });

    it("returns the passed-in state if the action does not have memoMeta", () => {
      const action = {};
      const state = {};
      const actual = reducer(state, action);
      const expected = {};
      expect(actual).toEqual(expected);
    });

    it("handles a _INIT action type", () => {
      const action = {
        type: "FETCH_SOMETHING_INIT",
        meta: {
          apiActionType: "FETCH_SOMETHING",
        },
      };
      const state = Immutable({});
      const actual = reducer(state, action);
      const expected = {
        FETCH_SOMETHING: {
          isLoading: true,
          error: null,
          apiArgs: null,
        },
      };
      expect(actual).toEqual(expected);
    });

    it("handles a success action type", () => {
      const action = {
        type: "FETCH_SOMETHING",
        meta: {
          apiActionType: "FETCH_SOMETHING",
          apiArgs: [111, 222],
        },
      };
      const state = Immutable({});
      const actual = reducer(state, action);
      const expected = {
        FETCH_SOMETHING: {
          isLoading: false,
          error: null,
          apiArgs: [111, 222],
        },
      };
      expect(actual).toEqual(expected);
    });

    it("handles a _FAILURE action type", () => {
      const action = {
        type: "FETCH_SOMETHING_FAILURE",
        error: {
          statusText: "there was an error",
        },
        meta: {
          apiActionType: "FETCH_SOMETHING",
          apiArgs: [111, 222],
        },
      };
      const state = Immutable({});
      const actual = reducer(state, action);
      const expected = {
        FETCH_SOMETHING: {
          isLoading: false,
          error: "there was an error",
          apiArgs: [111, 222],
        },
      };
      expect(actual).toEqual(expected);
    });
  });

  describe("getIsAllLoadedFactory selector", () => {
    it("returns true if finished loading", () => {
      const getIsAllLoaded = getIsAllLoadedFactory(["FETCH_SOMETHING"]);
      const state = {
        FETCH_SOMETHING: {
          isLoading: false,
          memoArgs: [],
        },
      };
      const isAllLoaded = getIsAllLoaded(state);
      expect(isAllLoaded).toBe(true);
    });

    it("returns false if not finished loading", () => {
      const getIsAllLoaded = getIsAllLoadedFactory(["FETCH_SOMETHING"]);
      const state = {
        FETCH_SOMETHING: {
          isLoading: true,
          memoArgs: null,
        },
      };
      const isAllLoaded = getIsAllLoaded(state);
      expect(isAllLoaded).toBe(false);
    });

    it("returns false if action type is not present", () => {
      const getIsAllLoaded = getIsAllLoadedFactory(["FETCH_SOMETHING"]);
      const state = {};
      const isAllLoaded = getIsAllLoaded(state);
      expect(isAllLoaded).toBe(false);
    });
  });

  describe("memoize decorator", () => {
    let store;
    const fetchSpy = jest.fn();

    function _fetchSomething(id1, id2) {
      return {
        type: "FETCH_SOMETHING",
        promise: () =>
          new Promise(resolve => {
            fetchSpy(id1, id2);
            resolve();
          }),
      };
    }

    beforeEach(() => {
      fetchSpy.mockClear();

      // Note: these tests use gluestick-shared's createStore and depend on its
      // promiseMiddelware and redux-thunk middleware.
      const client = null;
      const customRequire = () => ({
        apiMemoization: reducer,
      });
      const customMiddleware = [];
      store = createStore(client, customRequire, customMiddleware);
    });

    it("makes an api request on first use", () => {
      const fetchSomething = memoize(_fetchSomething);
      store.dispatch(fetchSomething(111, 222));
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it("does not make an api request if already called with the same arguments", async () => {
      const fetchSomething = memoize(_fetchSomething);
      await store.dispatch(fetchSomething(111, 222));
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      store.dispatch(fetchSomething(111, 222));
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it("makes an api request if called with different arguments", async () => {
      const fetchSomething = memoize(_fetchSomething);
      await store.dispatch(fetchSomething(111, 222));
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      store.dispatch(fetchSomething(111, 333));
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it("does not make an api request if another request is still loading", () => {
      function _fetchSomethingAndItTakesForever(id1, id2) {
        return {
          type: "FETCH_SOMETHING",
          promise: () =>
            new Promise(() => {
              fetchSpy(id1, id2);
            }),
        };
      }
      const fetchSomethingAndItTakesForever = memoize(
        _fetchSomethingAndItTakesForever,
      );
      store.dispatch(fetchSomethingAndItTakesForever(111, 222));
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      store.dispatch(fetchSomethingAndItTakesForever(111, 222));
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it("makes an api request if previous request failed", async () => {
      function _fetchSomethingAndItFails(id1, id2) {
        return {
          type: "FETCH_SOMETHING",
          promise: () =>
            new Promise((resolve, reject) => {
              fetchSpy(id1, id2);
              reject({ statusText: "there was an error" });
            }),
        };
      }
      const fetchSomethingAndItFails = memoize(_fetchSomethingAndItFails);
      await store.dispatch(fetchSomethingAndItFails(111, 222));
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      store.dispatch(fetchSomethingAndItFails(111, 222));
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it("returns a resolved promise if action is null", () => {
      function returnsNull() {
        return null;
      }
      const memoized = memoize(returnsNull);
      const result = store.dispatch(memoized());
      expect(result.then).toBeDefined();
    });
  });
});
