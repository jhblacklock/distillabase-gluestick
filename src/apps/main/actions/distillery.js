/* @flow */
import type { Axios, AxiosPromise } from "axios";
import { memoize } from "main/reducers/apiMemoization";
import type { FetchDistilleryResponse } from "main/types";

export type FetchDistilleryAction = number => {
  type: string,
  promise: Axios => AxiosPromise<FetchDistilleryResponse>,
};

const distilleriesPath = "/distilleries";

export const _fetchDistillery: FetchDistilleryAction = (
  distilleryId: number,
) => {
  return {
    type: "FETCH_DISTILLERY",
    promise: (httpClient: any) => {
      return httpClient.get(`${distilleriesPath}/${distilleryId}`);
    },
  };
};

export const fetchDistillery: Function = memoize(_fetchDistillery);
